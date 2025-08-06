from flask import Flask, render_template, request
from selenium import webdriver
from selenium.webdriver.common.by import By
import time

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/send', methods=['POST'])
def send():
    number = request.form['number']
    message = request.form['message']

    options = webdriver.ChromeOptions()
    options.add_argument("--user-data-dir=whatsapp_profile")  # save session

    driver = webdriver.Chrome(options=options)
    driver.get("https://web.whatsapp.com")
    input("Scan the QR code and press Enter...")  # only needed once

    driver.get(f"https://wa.me/{number}")
    time.sleep(5)

    try:
        driver.find_element(By.XPATH, "//a[contains(@href, 'send?phone')]").click()
        time.sleep(10)

        box = driver.find_element(By.XPATH, '//div[@contenteditable="true"][@data-tab="10"]')
        box.send_keys(message)
        box.send_keys(u'\ue007')  # press Enter

        result = f"Message sent to {number}"
    except Exception as e:
        result = f"Error: {str(e)}"

    driver.quit()
    return result

if __name__ == '__main__':
    app.run(debug=True)
