require("dotenv").config({ path: "../.env" });//from root env created

const express = require("express");
const cors = require("cors");
const Log = require("../logging_middleware/logger");

const app = express();
app.use(cors());
app.use(express.json());

/*
    API 1: Get notifications
*/
app.get("/notifications", async (req, res) => {

    await Log("backend", "info", "handler", "GET /notifications called");

    try {
        const data = [
            {
                id: 1,
                type: "Event",
                message: "New Hackathon",
                isRead: false,
                timestamp: Date.now()
            },
            {
                id: 2,
                type: "Placement",
                message: "Amazon interview scheduled",
                isRead: false,
                timestamp: Date.now()
            }
        ];

        await Log("backend", "info", "service", "Notifications fetched");

        res.json(data);

    } catch (err) {

        await Log("backend", "error", "service", "Error fetching notifications");

        res.status(500).json({ error: "Internal error" });
    }
});

/*
    API 2: Mark as read
*/
app.patch("/notifications/:id/read", async (req, res) => {

    await Log("backend", "info", "handler", "PATCH mark as read called");

    try {
        await Log("backend", "info", "service", `Notification ${req.params.id} marked as read`);

        res.json({ success: true });

    } catch (err) {

        await Log("backend", "error", "service", "Error marking notification");

        res.status(500).json({ error: "Internal error" });
    }
});

/*
    API 3: Create notification
*/
app.post("/notifications", async (req, res) => {

    await Log("backend", "info", "handler", "POST /notifications called");

    try {
        const { userId, type, message } = req.body;

        await Log("backend", "info", "service", `Notification created for ${userId}`);

        res.json({
            id: Date.now(),
            userId,
            type,
            message
        });

    } catch (err) {

        await Log("backend", "error", "service", "Error creating notification");

        res.status(500).json({ error: "Internal error" });
    }
});

app.listen(3001);