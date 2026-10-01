const fs = require('fs');

['src/pages/Admin.tsx', 'src/components/Header.tsx'].forEach(file => {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');
    code = code.replace(/\/logo\.png\?v=\d+/g, '/logo.png?v=' + Date.now());
    fs.writeFileSync(file, code);
  }
});
