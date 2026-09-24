const https = require('https');
const fs = require('fs');

https.get('https://raw.githubusercontent.com/Nezo25/forja-frontend/1e9bbc2/src/pages/Admin.tsx', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('Admin_Clean.tsx', data, 'utf8');
    console.log("Downloaded!");
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
