const fs = require('fs');
let code = fs.readFileSync('src/services/storage.ts', 'utf8');

code = code.replace(
  /const method = isEditing[^]*?return fullProduct;\n  }/m,
  `const method = isEditing && !id.startsWith('prod_') ? 'PUT' : 'POST';
    const url = isEditing && !id.startsWith('prod_') ? \`/models/\${id}\` : '/models';
  
    // Fire and forget API call for optimistic UI (doesn't block modal closing)
    fetchApi(url, { method, body: JSON.stringify(payload) })
      .then((savedFromApi: any) => {
        if (savedFromApi?.id) {
          const realId = savedFromApi.id.toString();
          const updatedWithRealId = getStoredProducts().map(p => p.id === id ? { ...p, id: realId } : p);
          saveProductsToStorage(updatedWithRealId);
        }
      })
      .catch(apiErr => {
        console.warn('Tentativa na API falhou, dados mantidos:', apiErr);
      });
  
    return fullProduct;
  }`
);

fs.writeFileSync('src/services/storage.ts', code);
