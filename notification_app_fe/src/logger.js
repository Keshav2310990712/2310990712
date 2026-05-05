const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrZXNoYXYwNzEyLmJlMjNAY2hpdGthcmEuZWR1LmluIiwiZXhwIjoxNzc3OTU5ODU0LCJpYXQiOjE3Nzc5NTg5NTQsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI2OTU4ZTIzYS04ZGI0LTRmOGMtOWE5My0zZDc3ZDI5M2U1MzQiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJrZXNoYXYiLCJzdWIiOiJmNjVkNmVkZS03ZWU4LTRmYjgtODIyMy0zZWE4YTE0NzAwOWQifSwiZW1haWwiOiJrZXNoYXYwNzEyLmJlMjNAY2hpdGthcmEuZWR1LmluIiwibmFtZSI6Imtlc2hhdiIsInJvbGxObyI6IjIzMTA5OTA3MTIiLCJhY2Nlc3NDb2RlIjoiRVhmdkRwIiwiY2xpZW50SUQiOiJmNjVkNmVkZS03ZWU4LTRmYjgtODIyMy0zZWE4YTE0NzAwOWQiLCJjbGllbnRTZWNyZXQiOiJyWHJCV0dlcEVkS3Rxdmh4In0.jFlaloSCAnvaayR0Hfb7N27U_xAfyF8sqwNwpQYA770";
const BASE_URL = "http://20.207.122.201/evaluation-service";

export async function Log(stack, level, pkg, message) {
    try {
        await fetch(`${BASE_URL}/log`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TOKEN}`
            },
            body: JSON.stringify({
                stack,
                level,
                package: pkg,
                message
            })
        });
    } catch (e) {}
}