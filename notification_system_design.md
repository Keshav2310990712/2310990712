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
```
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
```
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
```
{
  "userId": "string",
  "type": "Placement",
  "message": "You got placed"
}
```
---

### Real-Time Delivery

WebSockets are used for real-time notification delivery to users.  
This ensures low latency and avoids continuous polling.

## Stage 2: Database Design

### Database Choice
PostgreSQL is used due to its reliability, indexing support, and strong query performance.

---

### Table Schema
```
notifications (
  id UUID PRIMARY KEY,
  user_id VARCHAR,
  type VARCHAR,
  message TEXT,
  is_read BOOLEAN,
  created_at TIMESTAMP
)
```
---

### Scaling Challenges

- Large volume of notifications
- Slow queries on filtering and sorting
- Increased storage requirements

---

### Solutions

- Indexing on user_id and created_at
- Table partitioning by date
- Archiving old notifications

## Stage 3: Query Optimization

### Given Query
```
SELECT * FROM notifications
WHERE studentID = 1032 AND isRead = false
ORDER BY createdAt ASC;
```
---

### Issues

- Full table scan due to missing index
- Sorting overhead
- Inefficient for large datasets

---

### Optimization
```
CREATE INDEX idx_notifications
ON notifications (studentID, isRead, createdAt);
```
---

### Additional Query
```
SELECT DISTINCT studentID
FROM notifications
WHERE type = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```
## Stage 4: Performance Improvements

### Problem
Database gets overloaded when multiple users fetch notifications simultaneously.

---

### Solutions

1. Caching (Redis)
   - Store recent notifications
   - Reduce DB hits

2. Pagination
   - Limit number of records returned

3. Read Replicas
   - Separate read and write workloads

4. Lazy Loading
   - Load notifications in chunks

---

### Result

Improved response time and reduced database load.
## Stage 5: Reliability Design

### Problem

If sending notifications fails (email or push), system becomes inconsistent.

---

### Issues in naive approach

send_email()
save_to_db()
push_to_app()

- No retry mechanism
- Failure leads to data inconsistency

---

### Improved Design

Use asynchronous processing with queues.

---

### Flow

API → Queue → Worker

---

### Solution

1. Save notification to DB
2. Push notification to queue
3. Worker processes:
   - send email
   - push notification
4. Retry on failure

---

### Benefits

- Fault tolerance
- Scalability
- Reliable delivery

## Stage 6: Priority Logic

Notifications are prioritized based on type and recency.

Priority order:
Placement > Result > Event

Each notification is assigned a score:
score = type_weight + timestamp

Top 10 notifications are returned after sorting.