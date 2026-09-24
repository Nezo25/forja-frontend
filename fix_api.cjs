const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

c = c.replace(/const MOCK_ORDERS = \[[\s\S]*?\];\s*/, "");
c = c.replace(/const FILAMENTO = \[[\s\S]*?\];\s*/, "");

c = c.replace(/const \[orders, setOrders\] = useState\(MOCK_ORDERS\);/, "const [orders, setOrders] = useState<any[]>([]);");
c = c.replace(/const \[orcamentos, setOrcamentos\] = useState\(MOCK_STL\);/, "const [orcamentos, setOrcamentos] = useState(MOCK_STL);\n  const [filamentos, setFilamentos] = useState<any[]>([]);");

// Add useEffects for orders and filamentos!
c = c.replace(/setCatalog\(formatted\);\n      \}\n    \}\)\.catch\(console\.error\);\n  \}, \[\]\);/, "setCatalog(formatted);\n      }\n    }).catch(console.error);\n\n    fetchApi('/orders').then((data: any) => {\n      if (Array.isArray(data)) setOrders(data);\n    }).catch(console.error);\n\n    fetchApi('/filaments').then((data: any) => {\n      if (Array.isArray(data)) setFilamentos(data);\n    }).catch(console.error);\n\n  }, []);");

// Update FILAMENTO mapping to filamentos
c = c.replace(/FILAMENTO\.map/g, "filamentos.map");
c = c.replace(/f\.estoque/g, "f.stockG"); // The backend uses stockG and minStockG
c = c.replace(/f\.min/g, "f.minStockG");
c = c.replace(/f\.cor/g, "f.color");

fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');
