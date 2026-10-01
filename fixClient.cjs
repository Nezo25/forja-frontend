const fs = require('fs');
let code = fs.readFileSync('src/api/client.ts', 'utf8');

code = code.replace(
  /const response = await fetch\(url, \{\s*\.\.\.options,\s*headers: \{\s*'Content-Type': 'application\/json',\s*\.\.\.options\?\.headers,\s*\},\s*\}\);/,
  `const token = typeof window !== 'undefined' ? sessionStorage.getItem('__adm_token') : null;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': \`Bearer \${token}\` } : {}),
      ...options?.headers,
    },
  });`
);

fs.writeFileSync('src/api/client.ts', code);
