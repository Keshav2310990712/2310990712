# Notification System Design

## Stage 1: API Design

### Overview
The system is designed to manage notifications for students including Events, Results, and Placements.

---

### 1. Get Notifications

**Endpoint:**
GET /notifications

**Query Parameters:**
- userId (string)
- type (Event | Result | Placement)
- page (number)
- limit (number)

**Response:**
[
  {
    "id": "uuid",
    "userId": "string",
    "type": "Event",
    "message": "New event available",
    "isRead": false,
    "timestamp": "ISO date"
  }
]

---

### 2. Mark Notification as Read

**Endpoint:**
PATCH /notifications/:id/read

**Response:**
{
  "success": true
}

---

### 3. Create Notification

**Endpoint:**
POST /notifications

**Request Body:**
{
  "userId": "string",
  "type": "Placement",
  "message": "You got placed"
}

---

### Real-Time Delivery

WebSockets are used for real-time notification delivery to users.  
This ensures low latency and avoids continuous polling.

## Stage 2: Database Design


## Stage 3: Query Optimization

## Stage 4: Performance Improvements

## Stage 5: Reliability Design

