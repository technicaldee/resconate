const http = require('http');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'frontend', 'public', 'test_receipt.txt');
const fileBuffer = fs.readFileSync(filePath);
const boundary = '----WebKitFormBoundary' + Math.random().toString(16).slice(2);

const CRLF = '\r\n';
let parts = [];

function fieldPart(name, value) {
  return `--${boundary}${CRLF}Content-Disposition: form-data; name="${name}"${CRLF}${CRLF}${value}${CRLF}`;
}

function filePart(name, filename, data) {
  return `--${boundary}${CRLF}Content-Disposition: form-data; name="${name}"; filename="${filename}"${CRLF}Content-Type: text/plain${CRLF}${CRLF}`;
}

parts.push(fieldPart('name', 'Tester'));
parts.push(fieldPart('email', 'test@example.com'));
parts.push(fieldPart('comment', 'smoke'));
parts.push(fieldPart('amount', '20000'));
parts.push(fieldPart('plan', 'Starter'));
parts.push(filePart('receipt', path.basename(filePath), fileBuffer));

const preamble = parts.join('');
const closing = `${CRLF}--${boundary}--${CRLF}`;

const buffers = [Buffer.from(preamble, 'utf8'), fileBuffer, Buffer.from(closing, 'utf8')];
const contentLength = buffers.reduce((s, b) => s + b.length, 0);

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/checkout/transfer/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=' + boundary,
    'Content-Length': contentLength
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (e) => console.error('Request error', e));

for (const b of buffers) req.write(b);
req.end();
