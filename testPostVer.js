const http = require('https');
const data = JSON.stringify({ id_card_image: 'test', selfie_image: 'test' });
const options = {
  hostname: 'heartconnect-qa29.onrender.com',
  port: 443,
  path: '/api/users/4aa054a2-a82b-4fa4-9e78-291297fa63d6/verification',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};
const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('POST status:', res.statusCode, body));
});
req.write(data);
req.end();
