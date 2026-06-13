# VoyaLuxe - Premium Full-Stack Tourism Management System

**VoyaLuxe** is a premium, full-stack travel-tech startup platform specializing in luxury tourism experiences across **Tamil Nadu** and **Kerala**. Designed with a modern dark-themed glassmorphism aesthetic, it is fully optimized for desktop, tablet, and mobile views. 

This project is structured for a Computer Science Engineering portfolio, showcasing secure JWT session handling, SQL relationships, modular REST endpoints, and dynamic administrative dashboards.

---

## 🚀 Key Features

### 👤 User Core
* **Secure Authentication**: Register and log in securely (JWT session state).
* **Explore Paradises**: Browse and search destinations in Tamil Nadu and Kerala (e.g. Munnar, Alleppey, Ooty, Madurai, Kanyakumari) with budget and theme-based filtering.
* **Instant Booking**: Real-time guest size calculation and calendar verification (travel date restriction).
* **Booking Status Tracker**: Check history and monitor status requests (Pending, Approved, Rejected).
* **Wishlist Manager**: Curate travel lists (linked with database).
* **Reviews System**: Read experiences and submit ratings (1-5 stars).
* **Concierge Inquiries**: Interactive contact form.

### 🔑 Admin Dashboard
* **Dynamic Analytics**: View overall stats (Total Revenue in Rs., Active Packages, Clients count, Total Bookings).
* **CSS Data Charts**: Visual representation of bookings split between Kerala and Tamil Nadu.
* **Booking Approval Panel**: Approve or Reject pending user itineraries.
* **Destinations CRUD**: Add, edit, or delete travel destinations.
* **Packages CRUD**: Create, update, or remove tour packages linked to destinations.

---

## 🛠️ Technology Stack
* **Frontend**: React.js, Vite, React Router DOM (v6), Lucide Icons
* **Styling**: Vanilla CSS (CSS Variables, HSL color tokens, Glassmorphism backdrop-filters, custom keyframe transitions)
* **Backend**: Node.js, Express.js API, JSONWebToken, BcryptJS
* **Database**: SQLite3 (Promisified database wrapper)

---

## 📂 Project Structure
```text
tourism-management-system/
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT verification & role validation
│   │   ├── db.js               # Promise-based SQLite3 connection & table setup
│   │   ├── index.js            # Express API server & routes
│   │   └── seed.js             # Seeding script for sample packages
│   ├── database.sqlite         # SQLite database file (auto-generated)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Glassmorphic header navigation
│   │   │   └── Footer.jsx      # Multi-column footer
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global user session management
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Landing page with search controls
│   │   │   ├── Destinations.jsx # State & Category explorer
│   │   │   ├── DestinationDetails.jsx
│   │   │   ├── Packages.jsx    # Complete itineraries list & budget slider
│   │   │   ├── PackageDetails.jsx # Review form & booking panel
│   │   │   ├── UserDashboard.jsx # Booking timeline & wishlist explorer
│   │   │   ├── AdminDashboard.jsx # Analytics, chart, CRUD & approvals
│   │   │   ├── Profile.jsx     # Update info & avatar generator
│   │   │   ├── Contact.jsx     # Contact form submit
│   │   │   ├── About.jsx       # Vision & Project specifications
│   │   │   ├── Login.jsx       # Secure Sign In
│   │   │   └── Register.jsx    # Create Account
│   │   ├── utils/
│   │   │   └── api.js          # API client with JWT interceptor
│   │   ├── App.jsx             # Router definition
│   │   ├── index.css           # CSS design variables & global system
│   │   └── main.jsx            # React root mount
│   └── package.json
├── schema.sql                  # Database Schema Documentation
└── seed.sql                    # SQL Insert Statements Seeding
```

---

## 💻 Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v16.0.0 or higher recommended)
* npm (automatically bundled with Node)

---

### Step 1: Clone or Open Workspace
Ensure the directory structure matches the folder layout above.

---

### Step 2: Set Up Backend Server
1. Navigate into the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the database schema and seed data (destinations, luxury packages, and demo accounts):
   ```bash
   npm run seed
   ```
4. Start the backend API server:
   ```bash
   npm start
   ```
   *The server runs at **`http://localhost:3000`**.*

---

### Step 3: Set Up Frontend Client
1. Open a new terminal window and navigate into the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The app is hosted locally (typically at **`http://localhost:5173`** or **`http://localhost:5174`**).*

---

## 🧪 Testing Guide (Credentials)

Two demo accounts are created during the seed process for instant evaluation:

### 👤 1. Customer User Experience
* **Email**: `user@voyaluxe.com`
* **Password**: `userpassword`
* **Workflow**:
  1. Open the landing page, browse packages using the budget slider or state cards.
  2. Click on the heart icon on any package detail page to add it to your wishlist.
  3. Input a travel date and click **Book Package** to submit a pending request.
  4. View your booking request in the **User Dashboard** (bookings tab).

### 🔑 2. Administrative Experience
* **Email**: `admin@voyaluxe.com`
* **Password**: `adminpassword`
* **Workflow**:
  1. Sign in to access the **Admin Console** (the red layout panel).
  2. View real-time revenue tallies, Kerala vs Tamil Nadu stats split, and recent orders.
  3. Approve the pending booking from the Customer User.
  4. Edit existing packages, delete destinations, or add new listings.
  5. Sign out and log back in as the user to verify the status is now marked as **Approved / Paid**.

---

## 🔒 Security Practices Implemented
* **Pre-hashed Passwords**: Securely hashes passwords using BcryptJS before storing in the SQLite file database.
* **Role-Based Auth (RBAC)**: REST API middleware verifying user JWT and blocking administrative endpoints (`verifyAdmin` vs `verifyToken`).
* **Input Scrubber**: Validates booking guest sizes against package capacities.
* **Date Limits**: Prevents booking travel dates in the past.
