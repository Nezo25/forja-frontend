const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

if (!c.includes('showNewFilamentModal')) {
    c = c.replace(/const \[showNewModal, setShowNewModal\] = useState\(false\);/,
    `const [showNewModal, setShowNewModal] = useState(false);
  const [showNewFilamentModal, setShowNewFilamentModal] = useState(false);`);
}

if (!c.includes('function FilamentModal')) {
    const filamentModalCode = `
function FilamentModal({ onClose, onSave }: { onClose: () => void; onSave: (f: any) => void }) {
  const [form, setForm] = useState({ color: '', material: 'PLA', stockG: '', minStockG: '300' });
  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      color: form.color,
      material: form.material,
      stockGrams: parseFloat(form.stockG) || 0,
      minStockGrams: parseFloat(form.minStockG) || 0
    });
  }
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} />
      <div className="relative w-full max-w-sm overflow-y-auto rounded-2xl" style={{ background: '#111827', border: '1px solid #374151' }} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSave}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #374151' }}>
            <h2 className="font-extrabold text-lg" style={{ color: '#F9FAFB' }}>Nova Bobina</h2>
            <button type="button" onClick={onClose} className="text-sm px-3 py-1 rounded-lg" style={{ color: '#9CA3AF', background: '#1F2937' }}>✕</button>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <Field label="Cor *"><Input required placeholder="Ex: Vermelho Fogo" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} /></Field>
            <Field label="Material *"><Input required placeholder="Ex: PLA" value={form.material} onChange={e => setForm(f => ({ ...f, material: e.target.value }))} /></Field>
            <Field label="Estoque Atual (g) *"><Input required type="number" placeholder="1000" value={form.stockG} onChange={e => setForm(f => ({ ...f, stockG: e.target.value }))} /></Field>
            <Field label="Mínimo Recomendado (g) *"><Input required type="number" placeholder="300" value={form.minStockG} onChange={e => setForm(f => ({ ...f, minStockG: e.target.value }))} /></Field>
            <button type="submit" className="w-full h-11 rounded-xl font-extrabold text-sm mt-1" style={{ background: '#F97316', color: '#fff' }}>Salvar Filamento</button>
          </div>
        </form>
      </div>
    </div>
  );
}
`;
    c = c.replace(/export default function Admin\(\) \{/, filamentModalCode + '\nexport default function Admin() {');
}

c = c.replace(/\{section === 'estoque' && \(/, 
`{section === 'estoque' && (
            <button onClick={() => setShowNewFilamentModal(true)} className="ml-auto h-9 px-4 rounded-lg text-sm font-bold flex items-center gap-2 transition-all" style={{ background: '#F97316', color: '#fff' }}>
              + Nova Bobina
            </button>
          )}
          {section === 'estoque' && (`);

c = c.replace(/\{editingProduct && <ProductModal[\s\S]*?\}\} \/>\}/, 
`$&
      {showNewFilamentModal && <FilamentModal onClose={() => setShowNewFilamentModal(false)} onSave={(f) => {
        fetchApi('/admin/filaments', { method: 'POST', body: JSON.stringify(f) })
          .then((saved) => {
            setFilamentos(prev => [...prev, saved]);
            setShowNewFilamentModal(false);
          }).catch(console.error);
      }} />}`);

c = c.replace(/style=\{\{ color: low \? '#EF4444' : '#F9FAFB' \}\}>\{f\.stockG\} kg<\/span>/g,
`style={{ color: low ? '#EF4444' : '#F9FAFB' }}>{f.stockGrams || f.stockG} g</span>`);

c = c.replace(/const pct = Math\.min\(100, \(f\.stockG \/ \(f\.minStockG \* 5\)\) \* 100\);/g,
`const currentStock = f.stockGrams || f.stockG || 0; const minStock = f.minStockGrams || f.minStockG || 0; const pct = Math.min(100, minStock > 0 ? (currentStock / (minStock * 5)) * 100 : 0);`);

c = c.replace(/const low = f\.stockG < f\.minStockG;/g,
`const low = currentStock < minStock;`);

c = c.replace(/Mínimo recomendado: \{f\.minStockG\} kg/g,
`Mínimo recomendado: {minStock} g`);

c = c.replace(/onClick=\{\(\) => setFilamentos\(prev => prev\.filter\(x => x !== f\)\)\}/g,
`onClick={() => {
                                  if(confirm('Tem certeza?')) {
                                    fetchApi(\`/admin/filaments/\${f.id}\`, { method: 'DELETE' }).then(() => {
                                      setFilamentos(prev => prev.filter(x => x.id !== f.id));
                                    }).catch(console.error);
                                  }
                                }}`);

fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');