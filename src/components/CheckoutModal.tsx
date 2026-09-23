import { useState } from 'react';
import type { CartItem } from '@/data/products';

interface Props {
  open: boolean;
  cart: CartItem[];
  onClose: () => void;
  onSuccess: () => void;
}

type PayMethod = 'pix' | 'cartao' | 'boleto';

export function CheckoutModal({ open, cart, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({ nome: '', contato: '', cep: '', endereco: '', numero: '', complemento: '' });
  const [pay, setPay] = useState<PayMethod>('pix');
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      setTimeout(() => { onSuccess(); setStep('form'); }, 2000);
    }, 1400);
  }

  const payOptions: { id: PayMethod; icon: string; label: string; desc: string }[] = [
    { id: 'pix', icon: '⚡', label: 'PIX', desc: 'Aprovação imediata' },
    { id: 'cartao', icon: '💳', label: 'Cartão', desc: 'Até 12x sem juros' },
    { id: 'boleto', icon: '🧾', label: 'Boleto', desc: 'Vence em 3 dias úteis' },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} />
      <div
        className="relative w-full md:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl"
        style={{ background: '#111827', border: '1px solid #374151' }}
        onClick={e => e.stopPropagation()}
      >
        {step === 'success' ? (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-4">
            <div className="text-5xl">🎉</div>
            <h2 className="text-2xl font-extrabold" style={{ color: '#22C55E' }}>Pedido Confirmado!</h2>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>Entraremos em contato pelo WhatsApp/e-mail em breve.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #374151' }}>
              <h2 className="font-extrabold text-lg" style={{ color: '#F9FAFB' }}>📦 Finalizar Pedido</h2>
              <button type="button" onClick={onClose} className="text-sm px-3 py-1 rounded-lg" style={{ color: '#9CA3AF', background: '#1F2937' }}>Fechar</button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {/* Resumo */}
              <div className="p-3 rounded-xl" style={{ background: '#1F2937', border: '1px solid #374151' }}>
                <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B7280' }}>Resumo</div>
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1" style={{ borderBottom: i < cart.length - 1 ? '1px solid #374151' : 'none' }}>
                    <span style={{ color: '#D1D5DB' }}>{item.product.name} × {item.qty}</span>
                    <span className="font-bold" style={{ color: '#F97316' }}>R$ {(item.unitPrice * item.qty).toFixed(2).replace('.', ',')}</span>
                  </div>
                ))}
                <div className="flex justify-between text-base font-extrabold mt-2 pt-2" style={{ borderTop: '1px solid #374151' }}>
                  <span style={{ color: '#F9FAFB' }}>Total</span>
                  <span style={{ color: '#F97316' }}>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* Dados */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6B7280' }}>Dados de Entrega</div>
                <div className="flex flex-col gap-2.5">
                  {[
                    { key: 'nome', label: 'Nome completo', type: 'text', placeholder: 'Ash Ketchum', required: true },
                    { key: 'contato', label: 'WhatsApp ou E-mail', type: 'text', placeholder: '(11) 99999-0000 ou ash@pokemon.com', required: true },
                    { key: 'cep', label: 'CEP', type: 'text', placeholder: '00000-000', required: true },
                    { key: 'endereco', label: 'Endereço', type: 'text', placeholder: 'Rua Pallet, 1', required: true },
                    { key: 'numero', label: 'Número', type: 'text', placeholder: '42', required: true },
                    { key: 'complemento', label: 'Complemento', type: 'text', placeholder: 'Apto 3 (opcional)', required: false },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-[11px] font-semibold mb-1" style={{ color: '#9CA3AF' }}>{f.label}</label>
                      <input
                        type={f.type}
                        required={f.required}
                        placeholder={f.placeholder}
                        value={(form as any)[f.key]}
                        onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full h-9 px-3 rounded-lg text-sm outline-none transition-all"
                        style={{ background: '#1F2937', border: '1px solid #374151', color: '#F9FAFB' }}
                        onFocus={e => (e.target.style.borderColor = '#F97316')}
                        onBlur={e => (e.target.style.borderColor = '#374151')}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagamento */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6B7280' }}>Forma de Pagamento</div>
                <div className="flex gap-2">
                  {payOptions.map(o => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setPay(o.id)}
                      className="flex-1 flex flex-col items-center gap-1 p-3 rounded-xl transition-all"
                      style={pay === o.id
                        ? { background: 'rgba(249,115,22,0.12)', border: '1px solid #F97316', color: '#F97316' }
                        : { background: '#1F2937', border: '1px solid #374151', color: '#9CA3AF' }
                      }
                    >
                      <span className="text-xl">{o.icon}</span>
                      <span className="text-[12px] font-bold">{o.label}</span>
                      <span className="text-[10px]" style={{ color: pay === o.id ? '#F97316' : '#6B7280' }}>{o.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl font-extrabold text-sm transition-all mt-1"
                style={{ background: '#F97316', color: '#fff', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? '⏳ Processando...' : '✅ Confirmar Pedido'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
