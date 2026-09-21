const http = require('https');

function check() {
  http.get('https://heartconnect-qa29.onrender.com/api/admin/setup', (res) => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
      console.log(res.statusCode, body);
      if (res.statusCode === 200) {
        console.log('Admin seeded!');
        process.exit(0);
      } else {
        setTimeout(check, 5000);
      }
    });
  }).on('error', (e) => {
    console.error(e);
    setTimeout(check, 5000);
  });
}

check();
