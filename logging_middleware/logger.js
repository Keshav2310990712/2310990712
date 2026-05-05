require("dotenv").config();
const axios = require("axios");
const TOKEN = process.env.ACCESS_TOKEN;
const BASE_URL = process.env.BASE_URL;

async function Log(stack, level, pkg, message) {
    try {
        await axios.post(
            `${BASE_URL}/log`,
            {
                stack,
                level,
                package: pkg,
                message
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`
                }
            }
        );
    } catch (e) {}
}
module.exports = Log;