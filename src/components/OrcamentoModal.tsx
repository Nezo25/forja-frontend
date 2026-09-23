import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function OrcamentoModal({ open, onClose }: Props) {
  const [form, setForm] = useState({ nome: '', contato: '', descricao: '', escala: '', acabamento: '' });
  const [file, setFile] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => { setSent(false); onClose(); }, 2000);
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} />
      <div
        className="relative w-full md:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl"
        style={{ background: '#111827', border: '1px solid #374151' }}
        onClick={e => e.stopPropagation()}
      >
        {sent ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-4">
            <div className="text-5xl">📐</div>
            <h2 className="text-2xl font-extrabold" style={{ color: '#F97316' }}>Orçamento Enviado!</h2>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>Retornaremos com o orçamento em até 24h.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #374151' }}>
              <div>
                <h2 className="font-extrabold text-lg" style={{ color: '#F9FAFB' }}>📐 Orçamento STL</h2>
                <p className="text-[12px] mt-0.5" style={{ color: '#9CA3AF' }}>Envie seu modelo e receba orçamento personalizado</p>
              </div>
              <button type="button" onClick={onClose} className="text-sm px-3 py-1 rounded-lg" style={{ color: '#9CA3AF', background: '#1F2937' }}>✕</button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {/* Upload area */}
              <div
                className="relative flex flex-col items-center justify-center gap-2 p-8 rounded-xl cursor-pointer transition-all"
                style={{ background: '#1F2937', border: '2px dashed #374151' }}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); setFile(e.dataTransfer.files[0]?.name ?? null); }}
              >
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".stl,.obj,.3mf" onChange={e => setFile(e.target.files?.[0]?.name ?? null)} />
                <div className="text-3xl">{file ? '✅' : '📁'}</div>
                <div className="text-sm font-semibold" style={{ color: '#F9FAFB' }}>{file ?? 'Arraste ou clique para enviar o arquivo'}</div>
                <div className="text-[11px]" style={{ color: '#6B7280' }}>Formatos aceitos: .STL, .OBJ, .3MF</div>
              </div>

              {[
                { key: 'nome', label: 'Seu nome', placeholder: 'Ash Ketchum', type: 'text', required: true },
                { key: 'contato', label: 'WhatsApp ou E-mail', placeholder: '(11) 99999-0000', type: 'text', required: true },
                { key: 'escala', label: 'Escala desejada', placeholder: 'Ex: 1:10, tamanho real, Chibi...', type: 'text', required: false },
                { key: 'acabamento', label: 'Acabamento', placeholder: 'Cru, primer ou pintado?', type: 'text', required: false },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-[11px] font-semibold mb-1" style={{ color: '#9CA3AF' }}>{f.label}</label>
                  <input
                    type={f.type}
                    required={f.required}
                    placeholder={f.placeholder}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full h-9 px-3 rounded-lg text-sm outline-none"
                    style={{ background: '#1F2937', border: '1px solid #374151', color: '#F9FAFB' }}
                    onFocus={e => (e.target.style.borderColor = '#F97316')}
                    onBlur={e => (e.target.style.borderColor = '#374151')}
                  />
                </div>
              ))}

              <div>
                <label className="block text-[11px] font-semibold mb-1" style={{ color: '#9CA3AF' }}>Observações</label>
                <textarea
                  placeholder="Detalhes extras, referências, urgência..."
                  value={form.descricao}
                  onChange={e => setForm(prev => ({ ...prev, descricao: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                  style={{ background: '#1F2937', border: '1px solid #374151', color: '#F9FAFB' }}
                  onFocus={e => (e.target.style.borderColor = '#F97316')}
                  onBlur={e => (e.target.style.borderColor = '#374151')}
                />
              </div>

              <button type="submit" className="w-full h-11 rounded-xl font-extrabold text-sm" style={{ background: '#F97316', color: '#fff' }}>
                Enviar para Orçamento 🔩
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
