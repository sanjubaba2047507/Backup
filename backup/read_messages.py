import requests
import time

BOT_TOKEN = "7602316768:AAGdBVB0BOGEpokjqhEKIc4q8NISlr-6NgU"
URL = f"https://api.telegram.org/bot{BOT_TOKEN}/getUpdates"
OFFSET = 0

print("[*] Starting message interceptor...")

while True:
    try:
        res = requests.get(URL, params={"offset": OFFSET, "timeout": 10})
        data = res.json()

        for result in data.get("result", []):
            message = result.get("message", {})
            chat_id = message.get("chat", {}).get("id")
            sender = message.get("from", {}).get("first_name", "Unknown")
            text = message.get("text", "")

            print(f"[+] {sender} ({chat_id}) said: {text}")
            OFFSET = result["update_id"] + 1

    except Exception as e:
        print(f"[-] Error: {e}")

    time.sleep(2)
