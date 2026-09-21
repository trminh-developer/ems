const http = require('https');
const data = JSON.stringify({ role: 'ADMIN' });
const options = {
  hostname: 'heartconnect-qa29.onrender.com',
  port: 443,
  path: '/api/admin/users/123/role',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};
const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('PUT status:', res.statusCode, body));
});
req.write(data);
req.end();
