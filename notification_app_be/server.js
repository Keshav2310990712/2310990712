require("dotenv").config({ path: "../.env" });//from root env created
const getTopNotifications = require("./priority");

const express = require("express");
const cors = require("cors");
const Log = require("../logging_middleware/logger");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

/*
    API 1: Get notifications
*/
app.get("/notifications", async (req, res) => {

    await Log("backend", "info", "handler", "GET /notifications called");

    try {
    const now = Date.now();

const data = [
    {
        id: 1,
        type: "Event",
        message: "New Hackathon",
        isRead: false,
        timestamp: now - 100000
    },
    {
        id: 2,
        type: "Placement",
        message: "Amazon interview scheduled",
        isRead: false,
        timestamp: now
    }
];

        await Log("backend", "info", "service", "Notifications fetched");

        const top = getTopNotifications(data);

await Log("backend", "info", "service", "Top notifications calculated");

res.json(top);

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

        await Log("backend", "info", "handler", `Creating notification for user ${userId}`);

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


app.get("/external-notifications", async (req, res) => {

    await Log("backend", "info", "handler", "Fetching external notifications");

    try {
        const TOKEN = process.env.ACCESS_TOKEN;

        let url = `${process.env.BASE_URL}/notifications?limit=10&page=1`;

        if (req.query.type) {
            url += `&type=${req.query.type}`;
        }

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        });

        await Log("backend", "info", "service", "External API success");

        res.json(response.data);

    } catch (err) {
        console.log("ERROR:", err.response?.data || err.message);
        await Log("backend", "error", "service", "External API failed");

        res.status(500).json({ error: "Failed to fetch" });
    }
});


app.post("/log-proxy", async (req, res) => {

    try {
        const TOKEN = process.env.ACCESS_TOKEN;

        await axios.post(
            `${process.env.BASE_URL}/log`,
            req.body,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`
                }
            }
        );

        res.json({ success: true });

    } catch (e) {
        console.log("ERROR:", e.response?.data || e.message);
        res.status(500).json({ error: "log failed" });
    }
});

app.listen(3001, async () => {
    await Log("backend", "info", "handler", "Server started on port 3001");
});