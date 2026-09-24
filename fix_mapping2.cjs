const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const oldOrderFetch = etchApi('/orders').then((data: any) => {
      if (Array.isArray(data)) setOrders(data);
    }).catch(console.error);;

const newOrderFetch = etchApi('/orders').then((data: any) => {
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
    }).catch(console.error);;

const oldFilamentFetch = etchApi('/admin/filaments').then((data: any) => {
      if (Array.isArray(data)) setFilamentos(data);
    }).catch(console.error);;

const newFilamentFetch = etchApi('/admin/filaments').then((data: any) => {
      if (Array.isArray(data)) {
        setFilamentos(data.map((f: any) => ({
          id: f.id,
          color: f.colorName,
          material: f.materialType,
          stockG: (f.stockGrams / 1000).toFixed(2),
          minStockG: 1
        })));
      }
    }).catch(console.error);;

c = c.replace(oldOrderFetch, newOrderFetch);
c = c.replace(oldFilamentFetch, newFilamentFetch);

fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');