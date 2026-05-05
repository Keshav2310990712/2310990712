import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Select, MenuItem } from "@mui/material";
import { Log } from "../logger";


function Notifications() {
  const [data, setData] = useState([]);
  const [type, setType] = useState("");

  useEffect(() => {
    fetchNotifications("");
  }, []);

  async function fetchNotifications(selectedType = "") {
    await Log("frontend", "info", "component", "Fetching notifications");

    try {
      const res = await axios.get(`http://localhost:3001/external-notifications?type=${selectedType}`);

      let notifications = res.data.notifications || [];
      
      if (selectedType) {
        notifications = notifications.filter(n => n.Type === selectedType);
      }
      
      setData(notifications);

      await Log("frontend", "info", "api", "Notifications fetched successfully");
    } catch (err) {
      await Log("frontend", "error", "api", "Failed to fetch notifications");
    }
  }

  const handleChange = (e) => {
    const value = e.target.value;
    setType(value);
    fetchNotifications(value);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>

      {/* Filter */}
      <Select value={type} onChange={handleChange} displayEmpty>
        <MenuItem value="">All</MenuItem>
        <MenuItem value="Event">Event</MenuItem>
        <MenuItem value="Result">Result</MenuItem>
        <MenuItem value="Placement">Placement</MenuItem>
      </Select>

      {/* List */}
      {data.map((item) => (
        <Card
          key={item.ID}
          style={{
            marginTop: "15px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <CardContent>
            <Typography variant="h6">{item.Type}</Typography>
            <Typography>{item.Message}</Typography>
            <Typography variant="caption">
              {item.Timestamp}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default Notifications;