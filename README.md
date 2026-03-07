# Employee Leave Management System

A full-stack web application where **employees** can apply for leave and **employers** can approve or reject those requests.

## Tech Stack

- **Frontend:** Vue.js 3, Tailwind CSS 4, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)

## Features

### Employee
- Sign up and log in
- Apply for leave (Sick, Casual, Annual, Other)
- Specify leave type, start date, end date, and reason
- View all submitted leave applications with status (Pending / Approved / Rejected)

### Employer
- Sign up and log in
- View all employee leave requests with stats dashboard
- Approve or reject pending leave requests

### Security & Validation
- JWT-based authentication
- Role-based access control (Employee / Employer)
- Input validation with express-validator
- Password hashing with bcrypt
- Protected API routes with middleware

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

🔗 **Live URL:** _[To be added after deployment]_

## License

MIT
