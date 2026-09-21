const http = require('https');
const options = {
  hostname: 'heartconnect-qa29.onrender.com',
  port: 443,
  path: '/api/admin/users/123/verification/revoke',
  method: 'PUT'
};
const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('PUT revoke status:', res.statusCode, body));
});
req.end();
