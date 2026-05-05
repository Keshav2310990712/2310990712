import React, { useEffect, useState } from "react";
import axios from "axios";
import { Log } from "../logger";

function Notifications() {

    const [data, setData] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    async function fetchNotifications() {

        await Log("frontend", "info", "component", "Fetching notifications");

        try {
            const res = await axios.get("http://localhost:3001/notifications");

            setData(res.data);

            await Log("frontend", "info", "api", "Notifications fetched successfully");

        } catch (err) {

            await Log("frontend", "error", "api", "Failed to fetch notifications");
        }
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Notifications</h2>

            {data.map((item) => (
                <div key={item.id} style={{
                    border: "1px solid #ccc",
                    margin: "10px",
                    padding: "10px"
                }}>
                    <strong>{item.type}</strong>
                    <p>{item.message}</p>
                </div>
            ))}
        </div>
    );
}

export default Notifications;