const express = require('express');
const multer = require('multer');
const fs = require('fs-extra');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const upload = multer({ dest: 'uploads/' });

// ✅ Replace with your actual Telegram bot token and chat ID
const TELEGRAM_BOT_TOKEN = '7678670381:AAFPa1p6fFMB7ImwXIMYtjhRJ2arybZZ3io';
const TELEGRAM_CHAT_ID = '8175955990';

async function sendToTelegram(filePath, filename) {
  const form = new FormData();
  form.append('chat_id', TELEGRAM_CHAT_ID);
  form.append('document', fs.createReadStream(filePath), filename);

  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`,
      form,
      { headers: form.getHeaders() }
    );
    console.log(`📤 Uploaded to Telegram: ${filename}`);
  } catch (err) {
    console.error(`❌ Failed to send ${filename}:`, err.response?.data || err.message);
    throw err;
  }
}

app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send('❌ No file uploaded');

  const filePath = req.file.path;
  const filename = req.file.originalname;

  try {
    await sendToTelegram(filePath, filename);
    res.redirect('/success');
  } catch (err) {
    res.status(500).send('❌ Upload to Telegram failed');
  } finally {
    await fs.remove(filePath);
  }
});

app.get('/success', (req, res) => {
  res.send(`<h2>✅ File uploaded and sent to Telegram successfully.</h2>
            <p>You may now close this page.</p>`);
});

app.listen(8080, () => {
  console.log('🚀 Server started on http://0.0.0.0:8080');
  console.log('🟢 Waiting for file uploads at POST /api/upload');
});
