const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const { optionalAuth } = require('../middleware/auth');

// 1. GET Visitor Dashboard Stats
router.get('/stats', async (req, res) => {
    try {
        const total = await Visitor.countDocuments();
        const checkedIn = await Visitor.countDocuments({ status: 'Checked In' });
        const checkedOut = await Visitor.countDocuments({ status: 'Checked Out' });

        // Calculate today's visits
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const todayVisits = await Visitor.countDocuments({
            dateTime: { $gte: startOfToday, $lte: endOfToday }
        });

        // Group by purpose for insights
        const purposeBreakdown = await Visitor.aggregate([
            { $group: { _id: '$purposeOfVisit', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.status(200).json({
            total,
            checkedIn,
            checkedOut,
            todayVisits,
            purposeBreakdown
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve stats', details: err.message });
    }
});

// 2. GET all visitors or SEARCH by name/mobile/etc.
router.get('/', async (req, res) => {
    try {
        const { search, status, purpose, sortBy } = req.query;
        let query = {};

        // Search visitors by name, mobile, email, or badge
        if (search && search.trim() !== '') {
            const searchRegex = new RegExp(search.trim(), 'i');
            query.$or = [
                { visitorName: searchRegex },
                { mobileNumber: searchRegex },
                { emailAddress: searchRegex },
                { organizationName: searchRegex },
                { personToMeet: searchRegex },
                { badgeNumber: searchRegex }
            ];
        }

        // Filter by Status
        if (status && status !== 'All') {
            query.status = status;
        }

        // Filter by Purpose
        if (purpose && purpose !== 'All') {
            query.purposeOfVisit = purpose;
        }

        // Sort configuration
        let sortOption = { dateTime: -1, createdAt: -1 };
        if (sortBy === 'oldest') {
            sortOption = { dateTime: 1, createdAt: 1 };
        } else if (sortBy === 'name') {
            sortOption = { visitorName: 1 };
        }

        const visitors = await Visitor.find(query).sort(sortOption);
        res.status(200).json(visitors);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve visitors', details: err.message });
    }
});

// 3. GET single visitor record by ID
router.get('/:id', async (req, res) => {
    try {
        const visitor = await Visitor.findById(req.params.id);
        if (!visitor) {
            return res.status(404).json({ error: 'Visitor not found' });
        }
        res.status(200).json(visitor);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch visitor record', details: err.message });
    }
});

// 4. POST / ADD a new visitor record
router.post('/', optionalAuth, async (req, res) => {
    try {
        const {
            visitorName,
            mobileNumber,
            emailAddress,
            organizationName,
            personToMeet,
            purposeOfVisit,
            dateTime,
            status,
            badgeNumber,
            idProofType,
            idProofNumber,
            remarks
        } = req.body;

        // Validation for required fields
        if (!visitorName || !mobileNumber || !emailAddress || !organizationName || !personToMeet || !purposeOfVisit) {
            return res.status(400).json({
                error: 'Missing required visitor fields (Name, Mobile, Email, Organization, Person to Meet, Purpose).'
            });
        }

        const newVisitor = new Visitor({
            visitorName,
            mobileNumber,
            emailAddress,
            organizationName,
            personToMeet,
            purposeOfVisit,
            dateTime: dateTime ? new Date(dateTime) : new Date(),
            status: status || 'Checked In',
            badgeNumber,
            idProofType,
            idProofNumber,
            remarks,
            registeredBy: req.user ? req.user.name : 'Front Desk'
        });

        // Set checkOutTime if marked checked out immediately
        if (newVisitor.status === 'Checked Out') {
            newVisitor.checkOutTime = new Date();
        }

        const savedVisitor = await newVisitor.save();
        res.status(201).json(savedVisitor);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create visitor record', details: err.message });
    }
});

// 5. PUT / UPDATE visitor details
router.put('/:id', async (req, res) => {
    try {
        const updateData = { ...req.body };

        // If status is changed to Checked Out and checkOutTime is not set, set it now
        if (updateData.status === 'Checked Out' && !updateData.checkOutTime) {
            updateData.checkOutTime = new Date();
        } else if (updateData.status === 'Checked In') {
            updateData.checkOutTime = null;
        }

        const updatedVisitor = await Visitor.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedVisitor) {
            return res.status(404).json({ error: 'Visitor not found' });
        }

        res.status(200).json(updatedVisitor);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update visitor record', details: err.message });
    }
});

// 6. PATCH / Quick status toggle (Check In / Check Out)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status || !['Checked In', 'Checked Out'].includes(status)) {
            return res.status(400).json({ error: 'Valid status is required (Checked In or Checked Out)' });
        }

        const updateData = {
            status,
            checkOutTime: status === 'Checked Out' ? new Date() : null
        };

        const updatedVisitor = await Visitor.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedVisitor) {
            return res.status(404).json({ error: 'Visitor not found' });
        }

        res.status(200).json(updatedVisitor);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update visitor status', details: err.message });
    }
});

// 7. DELETE visitor record
router.delete('/:id', async (req, res) => {
    try {
        const deletedVisitor = await Visitor.findByIdAndDelete(req.params.id);
        if (!deletedVisitor) {
            return res.status(404).json({ error: 'Visitor not found' });
        }
        res.status(200).json({
            message: 'Visitor record deleted successfully',
            deletedId: req.params.id
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete visitor record', details: err.message });
    }
});

module.exports = router;
