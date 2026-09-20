const http = require('https');
const data = JSON.stringify({ 
  email: 'testrenderdb@heartconnect.com', 
  password: 'test', 
  firstName: 'Test', 
  lastName: 'Render', 
  gender: 'MALE', 
  dateOfBirth: '2000-01-01' 
});

const options = {
  hostname: 'heartconnect-qa29.onrender.com',
  port: 443,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('STATUS:', res.statusCode, 'BODY:', body));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
