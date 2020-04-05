from flask import Flask, send_file, render_template

app = Flask(__name__)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return send_file('src/html/index.html')

@app.route('/img/<filename>')
def image(filename):
    return send_file(f'static/img/{filename}')

@app.route('/vid/<filename>')
def video(filename):
    return send_file(f'static/vid/{filename}.mp4')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')