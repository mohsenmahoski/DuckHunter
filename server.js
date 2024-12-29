const express = require('express');
const path = require('path');
const crypto = require('crypto');
const app = express();
const port = process.env.PORT || 3000;
const secretKey = '1234567890';

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Route all requests to index.html
app.get('/', (req, res) => {
  // Generate encrypted code using AES-256-CBC
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey.padEnd(32)), iv);
  let uniqueCode = cipher.update('ITram', 'utf8', 'hex');
  uniqueCode += cipher.final('hex');
  // Combine IV and encrypted data
  uniqueCode = iv.toString('hex') + ':' + uniqueCode;

  const html = `<!DOCTYPE HTML>
                    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
                    <html>
                    <head>
                    <title>DuckHuntJS</title>
                    <meta name="apple-mobile-web-app-capable" content="yes">
                    <meta name="mobile-web-app-capable" content="yes">
                    <meta name="description" content="An open source, web based, responsive implementation of Duck Hunt in canvas or webgl depending on your client.">
                    <meta name="author" content="Matt Surabian">
                    <script>
                      window.uniqueCode = "${uniqueCode}";
                      (function() {
                        const script = document.currentScript;
                        script.parentNode.removeChild(script);
                      })();
                    </script>
                    <style>
                        body {
                        overflow:hidden;
                        margin: 0;
                        padding: 0;
                        background-color: #000000;
                        }
                    </style>
                    <script src="duckhunt.js"></script>
                    </head>
                    <body>
                    </body>
                    </html>`;

  // Minify the HTML to make it harder to read
  const minifiedHtml = html.replace(/\s+/g, ' ').trim();
  return res.send(minifiedHtml);
});

// Validate code endpoint
app.get('/:code', (req, res) => {
  try {
    const code = req.params.code;
    // Split IV and encrypted data
    const [ivHex, encryptedData] = code.split(':');

    // Convert hex to buffers
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey.padEnd(32)), iv);

    // Decrypt the data
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');


    res.json({
      valid: true,
      message: decrypted
    });
  } catch (error) {
    res.status(400).json({
      valid: false,
      error: 'Invalid code format'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});