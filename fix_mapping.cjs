const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

c = c.replace(/fetchApi\('\/orders'\)\.then\(\(data: any\) => \{\n      if \(Array\.isArray\(data\)\) setOrders\(data\);\n    \}\)\.catch\(console\.error\);/, etchApi('/orders').then((data: any) => {
      if (Array.isArray(data)) {
        setOrders(data.map((o: any) => ({
          id: '#' + o.id.toString().padStart(4, '0'),
          cliente: 'Cliente #' + o.customerId,
          produto: o.items && o.items.length > 0 ? o.items[0].pokemonModelName : 'Vazio',
          status: o.status,
          valor: o.totalAmount,
          data: new Date(o.createdAt).toLocaleDateString('pt-BR')
        })));
      }
    }).catch(console.error););

c = c.replace(/fetchApi\('\/admin\/filaments'\)\.then\(\(data: any\) => \{\n      if \(Array\.isArray\(data\)\) setFilamentos\(data\);\n    \}\)\.catch\(console\.error\);/, etchApi('/admin/filaments').then((data: any) => {
      if (Array.isArray(data)) {
        setFilamentos(data.map((f: any) => ({
          id: f.id,
          color: f.colorName,
          material: f.materialType,
          stockG: (f.stockGrams / 1000).toFixed(2),
          minStockG: 1
        })));
      }
    }).catch(console.error););

// Fix the 'o ' issue in headers
c = c.replace(/font-mono /g, 'font-mono');
c = c.replace(/Aguardando  anlise/g, 'Aguardando análise');
c = c.replace(/Oramento  enviado/g, 'Orçamento enviado');
c = c.replace(/Em impressǜo/g, 'Em impressão');
c = c.replace(/Aguardando  pgto/g, 'Aguardando pgto');
c = c.replace(/Y-" Deletar/g, '🗑 Deletar');
c = c.replace(/Y-' Deletar/g, '🗑 Deletar');

fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');
