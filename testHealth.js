const http = require('https');
http.get('https://heartconnect-qa29.onrender.com/api/health', (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(res.statusCode, body));
});
