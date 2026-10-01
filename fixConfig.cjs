const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');
code = code.replace(
  /function ApiConfigModal\(\{ onClose \}: \{ onClose: \(\) => void \}\) \{[\s\S]*?\/\/ ------------------- MAIN COMPONENT -------------------/,
  `// ------------------- MODAL: CONFIGURAÇÕES DA LOJA -------------------
function StoreConfigModal({ onClose }: { onClose: () => void }) {
  const [lang, setLang] = useState(localStorage.getItem('forja_lang') || 'pt');

  function handleSave() {
    localStorage.setItem('forja_lang', lang);
    window.dispatchEvent(new Event('forja_lang_changed'));
    window.location.reload();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="relative w-full max-w-lg overflow-y-auto rounded-2xl shadow-2xl p-6" style={{ background: '#111827', border: '1px solid #374151' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div>
            <h3 className="font-extrabold text-base text-gray-100">⚙️ Configurações da Loja</h3>
            <p className="text-xs text-gray-400">Preferências visuais e de idioma</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="py-4 flex flex-col gap-4">
          <Field label="Idioma dos Tipos Pokémon">
            <select value={lang} onChange={e => setLang(e.target.value)} className="w-full h-10 px-3 rounded-lg text-sm outline-none bg-gray-900 border border-gray-700 text-gray-100">
              <option value="pt">Português (ex: Fogo, Água)</option>
              <option value="en">Inglês (ex: Fire, Water)</option>
            </select>
          </Field>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 h-10 rounded-lg text-xs font-bold text-white cursor-pointer transition-all hover:opacity-90"
              style={{ background: '#F97316' }}
            >
              💾 Salvar e Atualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------- MAIN COMPONENT -------------------`
);
code = code.replace(
  /const \[showApiModal, setShowApiModal\] = useState\(false\);/,
  `const [showApiModal, setShowApiModal] = useState(false);`
);
code = code.replace(
  />\s*⚙️ Configurar API\s*<\/button>/,
  `>⚙️ Configurações da Loja</button>`
);
code = code.replace(
  /{showApiModal && <ApiConfigModal onClose={\(\) => setShowApiModal\(false\)} \/>}/,
  `{showApiModal && <StoreConfigModal onClose={() => setShowApiModal(false)} />}`
);
fs.writeFileSync('src/pages/Admin.tsx', code);
