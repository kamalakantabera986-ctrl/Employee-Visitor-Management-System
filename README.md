# 🏢 SecurePass – Employee Visitor Management System (MERN Stack)
### **IBM Industrial Visit Task – Full Stack Development (Problem Statement 1)**

An enterprise-grade, modern MERN Stack web application designed for corporate reception and administration teams to digitally record, manage, verify, and retrieve visitor records with end-to-end security, instant pass generation, and real-time analytics.

---

## 📌 Project Overview & Objectives

Organizations receive clients, students, vendors, contractors, and interview candidates regularly. Manual paper logs are error-prone, insecure, and cumbersome to search. 

**SecurePass** replaces legacy logbooks with a cloud-connected digital system featuring:
- **Instant Digital Check-In / Check-Out** with live status indicators
- **Full CRUD Management** (Create, Read, Update, Delete)
- **Live Search & Filter** by visitor name or mobile number
- **Role-Based Authentication** (Sign In & Sign Up with JWT and Bcrypt)
- **Printable Visitor Badges / Passes** with barcode & QR styling
- **CSV Data Export** for security audits and administrative compliance
- **Real-Time KPI Dashboard** for active on-premises visitor tracking

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, Vite, Vanilla CSS (Executive Glassmorphic Theme), Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Cloud Cluster: `cluster0.smtufuj.mongodb.net`) |
| **Authentication** | JWT (JSON Web Tokens), `bcryptjs` password hashing |
| **Typography** | Google Fonts (`Plus Jakarta Sans`, `JetBrains Mono`) |

---

## ⚙️ MongoDB Atlas Configuration

The application is pre-configured with the credentials:
- **Atlas Username:** `kamalakantabera986_db_user`
- **Atlas Password:** `DDnzMXMcj8tenA00`
- **Database:** `visitor-management`
- **Connection URI:**
  ```env
  MONGO_URI=mongodb+srv://kamalakantabera986_db_user:DDnzMXMcj8tenA00@cluster0.smtufuj.mongodb.net/visitor-management?retryWrites=true&w=majority&appName=Cluster0
  ```

---

## 📋 Visitor Information Fields

Each visitor entry tracks complete identity and audit attributes:
- **Visitor Name:** Full name of the visitor *(Required)*
- **Mobile Number:** Phone number with country code *(Required, Validated)*
- **Email Address:** Work/personal email address *(Required, Validated)*
- **Organization / College Name:** Visitor affiliation *(Required)*
- **Person to Meet:** Host employee and department *(Required)*
- **Purpose of Visit:** Client Meeting, Campus Tour, Interview, Vendor, Delivery, etc. *(Required)*
- **Date and Time of Visit:** Timestamp of entry *(Defaults to current time)*
- **Check-Out Time:** Timestamp recorded automatically upon checking out
- **Status:** `Checked In` or `Checked Out` (Real-time pulsing status)
- **Badge Number:** Auto-generated unique security ID (e.g., `VIS-26-1807`)
- **ID Proof Type & Number:** Aadhaar, Student ID, Employee ID, Passport, DL
- **Remarks:** Security / NDA gate notes

---

## 🚀 Key Features

### 1. Reception Staff Authentication (Sign In / Sign Up)
- Secure registration and login using JWT and `bcryptjs`.
- Role assignment (`Receptionist`, `Admin`, `Security Officer`).
- Fast **"1-Click Demo Login"** button for immediate evaluation (`admin@ibm-visit.com` / `adminpassword123`).

### 2. Complete CRUD Operations
- **Create:** Click **"Register New Visitor"** to open a modal with real-time validation.
- **Read / View:** Interactive, responsive data table with status pills, avatars, and contact links.
- **Update:** Full edit modal to update visitor details or notes at any time.
- **Delete:** Safe delete modal with confirmation to prevent accidental loss.

### 3. Real-Time Search & Multi-Level Filtering
- **Live Search:** Instant debounced search querying **Visitor Name**, **Mobile Number**, **Email**, or **Badge Code**.
- **Status Filters:** Quick toggle buttons for **All**, **Checked In**, and **Checked Out**.
- **Purpose Filter:** Dropdown filter for specific visit categories.

### 4. 1-Click Status Toggle
- Quickly check out any active visitor with a single click. The system records the exact check-out timestamp automatically.

### 5. Printable Digital Visitor Pass
- Generates a styled on-premises pass card with organization details, visitor name, host name, purpose, barcode/QR visual, and entry time.
- Direct **"Print Visitor Pass"** button formatted for standard badge printers (`window.print()`).

### 6. CSV Export & Audit Log
- One-click export downloads a structured CSV spreadsheet of all visitor records for daily reporting.

---

## 🏃‍♂️ How to Run Locally

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **npm**: v9+ or v10+

### 2. Start Backend Server
```bash
cd backend
npm install
node server.js
```
The backend API starts on **`http://localhost:5001`** and connects to MongoDB Atlas.

### 3. Start Frontend Application
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The React frontend starts on **`http://localhost:5173`**.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register new staff account |
| `POST` | `/api/auth/login` | Sign in with email and password |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `POST` | `/api/auth/seed-demo` | Quick-seed and return demo admin credentials |
| `GET` | `/api/visitors` | List all visitors (Supports `?search=`, `?status=`, `?purpose=`) |
| `GET` | `/api/visitors/stats` | Return KPI metrics (Total, Checked In, Checked Out, Today) |
| `GET` | `/api/visitors/:id` | Get single visitor details by ID |
| `POST` | `/api/visitors` | Register new visitor (Auto-assigns badge number) |
| `PUT` | `/api/visitors/:id` | Update complete visitor details |
| `PATCH` | `/api/visitors/:id/status` | Toggle status (`Checked In` / `Checked Out`) |
| `DELETE` | `/api/visitors/:id` | Delete visitor record |

---

## 👨‍💻 Author
**Kamalakanta Bera**  
*IBM Industrial Visit Task – Full Stack Development (Problem Statement 1)*
