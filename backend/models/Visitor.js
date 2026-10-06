const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    visitorName: {
        type: String,
        required: [true, 'Visitor Name is required'],
        trim: true
    },
    mobileNumber: {
        type: String,
        required: [true, 'Mobile Number is required'],
        trim: true
    },
    emailAddress: {
        type: String,
        required: [true, 'Email Address is required'],
        trim: true,
        lowercase: true
    },
    organizationName: {
        type: String,
        required: [true, 'Organization/College Name is required'],
        trim: true
    },
    personToMeet: {
        type: String,
        required: [true, 'Person to Meet is required'],
        trim: true
    },
    purposeOfVisit: {
        type: String,
        required: [true, 'Purpose of Visit is required'],
        trim: true
    },
    dateTime: {
        type: Date,
        default: Date.now
    },
    checkOutTime: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['Checked In', 'Checked Out'],
        default: 'Checked In'
    },
    badgeNumber: {
        type: String,
        trim: true
    },
    idProofType: {
        type: String,
        enum: ['National ID / Aadhaar', 'College / Student ID', 'Employee ID', 'Passport', 'Driving License', 'Other'],
        default: 'National ID / Aadhaar'
    },
    idProofNumber: {
        type: String,
        trim: true,
        default: ''
    },
    remarks: {
        type: String,
        trim: true,
        default: ''
    },
    registeredBy: {
        type: String,
        default: 'Reception Desk'
    }
}, { timestamps: true });

// Auto-assign badge number if missing before saving
visitorSchema.pre('save', function (next) {
    if (!this.badgeNumber) {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        this.badgeNumber = `VIS-${new Date().getFullYear().toString().slice(-2)}-${randomSuffix}`;
    }
    next();
});

module.exports = mongoose.model('Visitor', visitorSchema);
