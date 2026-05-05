# Notification System Design

## Stage 1: API Design

### Overview

The system provides a notification platform for students to view **Events, Results, and Placements**.
Notifications are fetched from an external service and processed via a backend layer.

---

## 🔹 Core Architecture

```text
Frontend (React)
       ↓
Backend (Node.js)
       ↓
Affordmed External APIs
```

* Backend acts as a **proxy layer**
* Logging is handled via **custom logging middleware**
* No authentication required for users (as per problem statement)

---

## 1. Get Notifications

**Endpoint:**

```
GET /external-notifications
```

**Query Parameters:**

* `type` → Event | Result | Placement
* `page` → number
* `limit` → number

**Example Request:**

```
GET /external-notifications?type=Placement&page=1&limit=10
```

**Response:**

```
[
  {
    "id": "uuid",
    "type": "Placement",
    "message": "Amazon hiring",
    "timestamp": "2026-05-04 09:00:05"
  }
]
```

---

## 2. Logging Middleware API (Internal)

**Endpoint:**

```
POST /log-proxy
```

**Purpose:**
Used internally to send logs to external logging service.

**Request Body:**

```
{
  "stack": "backend",
  "level": "info",
  "package": "handler",
  "message": "fetch notifications success"
}
```

**Response:**

```
{
  "logID": "uuid",
  "message": "log created successfully"
}
```

---

## 🔹 Important Constraint

* ❌ No `console.log` allowed
* ❌ No inbuilt loggers
* ✔ Only logging middleware must be used

---

## Real-Time Delivery

Instead of WebSockets, the current system uses:

* API polling (frontend fetch)
* Can be extended to WebSockets in production

---

# Stage 2: Database Design

### Note:

Current implementation **does NOT store notifications locally**.
Notifications are fetched from external API.

---

## Proposed Database (for scalability)

**Database:** PostgreSQL

```
notifications (
  id UUID PRIMARY KEY,
  type VARCHAR,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP
)
```

---

## Scaling Challenges

* High read frequency
* Large dataset (millions of notifications)
* Sorting + filtering cost

---

## Solutions

* Indexing on `(type, created_at)`
* Pagination
* Optional caching layer (Redis)

---

# Stage 3: Query Optimization

### Given Query

```
SELECT * FROM notifications
WHERE studentID = 1032 AND isRead = false
ORDER BY createdAt ASC;
```

---

## Issues

* ❌ `SELECT *` → unnecessary data
* ❌ Missing composite index
* ❌ Sorting on large dataset

---

## Optimized Approach

```
CREATE INDEX idx_notifications
ON notifications (studentID, isRead, createdAt);
```

---

## Better Query

```
SELECT id, message, createdAt
FROM notifications
WHERE studentID = 1032 AND isRead = false
ORDER BY createdAt ASC
LIMIT 50;
```

---

## Additional Query

```
SELECT DISTINCT studentID
FROM notifications
WHERE type = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```

---

# Stage 4: Performance Improvements

### Problem

Multiple users hitting APIs → high latency

---

## Solutions

### 1. Backend Proxy Optimization

* Reduce repeated external API calls
* Batch requests if possible

### 2. Pagination

* Already implemented via `page` & `limit`

### 3. Caching (Optional Enhancement)

* Cache recent notifications per type

### 4. API Filtering

* Backend ensures only required type is returned

---

# Stage 5: Reliability Design

### Problem

Naive flow:

```
send_email()
save_to_db()
push_to_app()
```

❌ No retry
❌ Partial failure risk

---

## Improved Design

```
Request → Queue → Worker
```

---

## Flow

1. Receive notification request
2. Store in DB (if implemented)
3. Push job to queue
4. Worker processes:

   * send email
   * push notification
5. Retry on failure

---

## Benefits

* Fault tolerance
* Scalability
* Reliable delivery

---

# Stage 6: Priority Logic

### Requirement

Show **Top N important notifications**

---

## Priority Rules

```
Placement > Result > Event
```

---

## Scoring Function

```
score = weight(type) + recency_score
```

Where:

* Placement = 3
* Result = 2
* Event = 1

---

## Implementation Logic

1. Fetch notifications from API
2. Assign weight
3. Sort by:

   * weight DESC
   * timestamp DESC
4. Return top N (e.g., 10)

---

## Example (Pseudo)

```
notifications
  .map(n => ({
    ...n,
    score: weight(n.type) + new Date(n.timestamp).getTime()
  }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 10)
```