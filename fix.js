const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const target = <button
                                onClick={() => toggleActive(p.id)}
                                className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
                                style={{ background: '#1F2937', border: '1px solid #374151', color: '#9CA3AF' }}
                              >
                                {p.active ? '⏸ Pausar' : '▶ Ativar'}
                              </button>;

const replacement = <button
                                onClick={() => setEditingProduct(p)}
                                className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all hover:bg-[#374151]"
                                style={{ background: '#1F2937', border: '1px solid #374151', color: '#60A5FA' }}
                              >
                                ✏️ Editar
                              </button>
                               + target;

content = content.replace(target, replacement);

const targetBtn = Salvar Produto 🛠️</button>;
const replacementBtn = {initialData ? "Atualizar Produto" : "Salvar Produto"} 🛠️</button>;
content = content.replace(targetBtn, replacementBtn);

fs.writeFileSync('src/pages/Admin.tsx', content);
