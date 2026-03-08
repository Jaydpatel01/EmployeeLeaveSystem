# Employee Leave Management System

A production-grade full-stack web application for managing employee leave requests. Employees can apply for leave and track their application status, while employers can review, approve or reject requests — all through a polished, responsive UI.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue.js 3, Vue Router 5, Tailwind CSS 4, Vite 7 |
| Backend | Node.js, Express 5, express-validator 7 |
| Database | MongoDB Atlas (Mongoose 9) |
| Auth | JWT (JSON Web Tokens), bcryptjs |
| Deployment | Render (free tier) |

## Features

### Authentication & Authorization
- JWT-based authentication with secure token storage
- Role-based access control (Employee / Employer)
- Email format validation (regex + express-validator `isEmail()` + `normalizeEmail()`)
- Password strength requirements (min 6 chars, at least one letter and one number)
- Auto-logout on token expiration with 401 interceptor
- Protected routes with Vue Router navigation guards

### Employee Dashboard
- Apply for leave with type selection (Sick, Casual, Annual, Other)
- Date validation — start date cannot be in the past, end date must be ≥ start date
- Leave stats summary cards (Total / Pending / Approved / Rejected)
- Full leave history table with color-coded status badges
- Real-time form validation with inline error messages
- Empty state illustrations when no leaves exist

### Employer Dashboard
- View all employee leave requests in a sortable table
- Filter by status (All / Pending / Approved / Rejected)
- Search by employee name or email
- Approve or reject with confirmation dialog
- Stats overview with pending/approved/rejected counts
- Auto-refreshing data after status updates

### UI/UX
- Fully responsive design — works on mobile, tablet, and desktop
- Mobile hamburger navigation menu
- Gradient backgrounds and modern card-based layouts
- Password strength indicator on registration (Weak → Very Strong)
- Role selection via styled cards instead of dropdowns
- 404 page with navigation options
- Page title updates on route changes
- Loading states and success/error feedback on all actions

### Security & Validation
- Server-side input validation with express-validator 7
- Name sanitization and length limits (2–50 characters)
- Reason length validation (3–500 characters)
- Date validation preventing past/invalid date ranges
- XSS protection via input trimming and escaping
- Global error handler middleware
- Request timeout handling (15s)
- Network error detection

## Project Structure

```
EmployeeLeaveSystem/
├── client/                  # Vue.js frontend
│   ├── src/
│   │   ├── views/           # Login, Register, Employee & Employer Dashboards
│   │   ├── router/          # Vue Router with auth guards
│   │   ├── services/        # Axios API service with interceptors
│   │   ├── App.vue          # Root component with navigation
│   │   ├── main.js          # App entry point
│   │   └── style.css        # Tailwind CSS import
│   ├── .env.example
│   └── package.json
├── server/                  # Express.js backend
│   ├── config/db.js         # MongoDB connection
│   ├── controllers/         # Auth & Leave controllers
│   ├── middleware/           # JWT auth & error handler
│   ├── models/              # User & Leave Mongoose models
│   ├── routes/              # Auth & Leave API routes
│   ├── .env.example
│   ├── index.js             # Server entry point
│   └── package.json
├── package.json             # Root scripts
├── .gitignore
└── README.md
```

## API Endpoints

### Authentication

| Method | Endpoint             | Description          | Auth Required |
|--------|----------------------|----------------------|---------------|
| POST   | `/api/auth/register` | Register a new user  | No            |
| POST   | `/api/auth/login`    | Login user           | No            |
| GET    | `/api/auth/profile`  | Get current user     | Yes           |

**Register Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employee"
}
```

**Login Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Leave Management

| Method | Endpoint          | Description               | Auth Required | Role     |
|--------|-------------------|---------------------------|---------------|----------|
| POST   | `/api/leaves`     | Apply for leave           | Yes           | Employee |
| GET    | `/api/leaves/my`  | Get my leave applications | Yes           | Employee |
| GET    | `/api/leaves`     | Get all leave requests    | Yes           | Employer |
| PATCH  | `/api/leaves/:id` | Approve/reject a leave    | Yes           | Employer |

**Apply Leave Request Body:**
```json
{
  "leaveType": "sick",
  "startDate": "2026-03-10",
  "endDate": "2026-03-12",
  "reason": "Medical appointment"
}
```

**Update Leave Status Request Body:**
```json
{
  "status": "Approved"
}
```

Leave types: `sick`, `casual`, `annual`, `other`

Status values: `Pending`, `Approved`, `Rejected`

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (free tier)

### 1. Clone the repository
```bash
git clone <repository-url>
cd EmployeeLeaveSystem
```

### 2. Set up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get the connection string
5. Whitelist your IP (or use `0.0.0.0/0` for allowing all IPs)

### 3. Configure environment variables
```bash
# Server
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI and a JWT secret
```

**server/.env:**
```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/employee-leave-system
JWT_SECRET=your_secure_random_string_here
```

### 4. Install dependencies
```bash
npm run install:all
```

### 5. Build the frontend
```bash
npm run build:client
```

### 6. Start the application
```bash
npm start
```

The app will be available at `http://localhost:5000`

### Development Mode
Run the backend and frontend separately:
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend (with hot reload)
npm run dev:client
```

## Deployment (Render)

### Deploy as a single web service on Render (Free Tier)

1. Push the code to a GitHub repository

2. Go to [Render Dashboard](https://dashboard.render.com) and create a **New Web Service**

3. Connect your GitHub repository

4. Configure the service:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Root Directory:** (leave empty)

5. Add environment variables in Render dashboard:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a secure random string
   - `NODE_ENV` — `production`

6. Deploy — Render will build the frontend and start the backend, serving everything from a single URL.

### Important Notes for Deployment
- Make sure MongoDB Atlas **Network Access** allows connections from `0.0.0.0/0` (all IPs) since Render uses dynamic IPs
- The free tier on Render spins down after inactivity; first request may take ~30 seconds

## Live Demo

🔗 **Live URL:** [https://employeeleavesystem.onrender.com](https://employeeleavesystem.onrender.com)

> **Note:** Free-tier Render services spin down after inactivity. The first request may take ~30 seconds to wake up.

## License

MIT
