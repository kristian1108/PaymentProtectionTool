const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 8080;

const app = express();
const DIST_DIR = __dirname;
const HTML_FILE = path.join(DIST_DIR, '/src/html/index.html');

app.use(express.static(DIST_DIR));

app.get('*', (req, res) => {
    res.sendFile(HTML_FILE)
});

app.listen(PORT);