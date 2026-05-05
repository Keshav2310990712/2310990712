# Notification System (Full Stack)

A full-stack notification system that fetches, filters, prioritizes, and displays notifications with a logging-first architecture.

---

## Tech Stack

**Backend:** Node.js, Express.js, Axios  
**Frontend:** React.js, Material UI, Axios

---

## Project Structure

```
.
├── logging_middleware/          # Logging service
├── notification_app_be/         # Backend API
├── notification_app_fe/         # React frontend
├── notification_system_design.md
├── .env
└── README.md
```

---

## Setup

### 1. Environment Variables

Create `.env` in root:

```env
ACCESS_TOKEN=your_access_token
BASE_URL=http://20.207.122.201/evaluation-service
```

### 2. Install Dependencies

```bash
# Backend
cd notification_app_be
npm install

# Frontend
cd notification_app_fe
npm install
```

### 3. Run Application

```bash
# Terminal 1: Backend (port 3001)
cd notification_app_be
node server.js

# Terminal 2: Frontend (port 3000)
cd notification_app_fe
npm start
```

---

## Features

- Fetch notifications from external API via backend proxy
- Filter by type (Event, Result, Placement)
- Priority ranking: Placement > Result > Event
- Centralized logging middleware
- Material UI for clean interface

---

## Architecture

**Frontend → Backend Proxy → External API**

The backend acts as a proxy to:
- Handle CORS issues
- Secure API calls with authentication
- Manage logging

---

## Screenshots
Provided in the screenshots folder

## Notes

- No console logging (uses custom logging middleware)
- Production-ready code structure
- See `notification_system_design.md` for full documentation

