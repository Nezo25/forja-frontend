const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');
code = code.replace(
  /<Field label="Tipos \(separados por vírgula\)">[\s\S]*?<\/Field>/,
  `<Field label="Tipos de Pokémon (Múltipla escolha)">
  <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 border border-gray-700 rounded-lg bg-gray-900">
    {ALL_TYPES.map(t => (
      <label key={t} className="flex items-center gap-1.5 cursor-pointer hover:bg-gray-800 p-1 rounded transition-colors">
        <input type="checkbox" className="accent-orange-500 w-3.5 h-3.5" 
          checked={form.types.split(',').map(x=>x.trim()).includes(t)}
          onChange={(e) => {
            const curr = form.types.split(',').map(x=>x.trim()).filter(Boolean);
            if (e.target.checked) curr.push(t);
            else curr.splice(curr.indexOf(t), 1);
            setForm(f => ({ ...f, types: curr.join(', ') }));
          }}
        />
        <span className="text-[11px] text-gray-300 font-medium">{t}</span>
      </label>
    ))}
  </div>
</Field>`
);
fs.writeFileSync('src/pages/Admin.tsx', code);
