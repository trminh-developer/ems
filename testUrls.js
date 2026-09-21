const http = require('https');
const urls = [
  '/api/admin/setup',
  '/setup',
  '/api/admin/api/admin/setup'
];

urls.forEach(path => {
  http.get('https://heartconnect-qa29.onrender.com' + path, (res) => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => console.log(path, '->', res.statusCode));
  });
});
