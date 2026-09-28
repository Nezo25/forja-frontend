const fs = require('fs');
let c = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Find and remove the Link block to /admin
const startIndex = c.indexOf('<Link\n              to="/admin"');
if (startIndex !== -1) {
    const endIndex = c.indexOf('</Link>', startIndex) + '</Link>'.length;
    c = c.slice(0, startIndex) + c.slice(endIndex);
} else {
    // try single line if format changed
    const start2 = c.indexOf('<Link to="/admin"');
    if (start2 !== -1) {
        const end2 = c.indexOf('</Link>', start2) + '</Link>'.length;
        c = c.slice(0, start2) + c.slice(end2);
    }
}

fs.writeFileSync('src/components/Header.tsx', c, 'utf8');