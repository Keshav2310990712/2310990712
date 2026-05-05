import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Select, MenuItem } from "@mui/material";
import { Log } from "../logger";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrZXNoYXYwNzEyLmJlMjNAY2hpdGthcmEuZWR1LmluIiwiZXhwIjoxNzc3OTU5ODU0LCJpYXQiOjE3Nzc5NTg5NTQsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI2OTU4ZTIzYS04ZGI0LTRmOGMtOWE5My0zZDc3ZDI5M2U1MzQiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJrZXNoYXYiLCJzdWIiOiJmNjVkNmVkZS03ZWU4LTRmYjgtODIyMy0zZWE4YTE0NzAwOWQifSwiZW1haWwiOiJrZXNoYXYwNzEyLmJlMjNAY2hpdGthcmEuZWR1LmluIiwibmFtZSI6Imtlc2hhdiIsInJvbGxObyI6IjIzMTA5OTA3MTIiLCJhY2Nlc3NDb2RlIjoiRVhmdkRwIiwiY2xpZW50SUQiOiJmNjVkNmVkZS03ZWU4LTRmYjgtODIyMy0zZWE4YTE0NzAwOWQiLCJjbGllbnRTZWNyZXQiOiJyWHJCV0dlcEVkS3Rxdmh4In0.jFlaloSCAnvaayR0Hfb7N27U_xAfyF8sqwNwpQYA770"; 

function Notifications() {
  const [data, setData] = useState([]);
  const [type, setType] = useState("");

  useEffect(() => {
    fetchNotifications("");
  }, []);

  async function fetchNotifications(selectedType = "") {
    await Log("frontend", "info", "component", "Fetching notifications");

    try {
      let url = `http://20.207.122.201/evaluation-service/notifications?limit=10&page=1`;

      if (selectedType) {
        url += `&type=${selectedType}`;
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      setData(res.data.notifications || []);

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