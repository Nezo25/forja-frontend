import { useState } from 'react';
import type { CartItem } from '@/data/products';
import { toast } from '@/components/Toast';

const API = (import.meta as any).env?.VITE_API_URL ?? 'https://forja-backend.onrender.com';

interface Props {
  open: boolean;
  cart: CartItem[];
  onClose: () => void;
  onSuccess: () => void;
}

type PayMethod = 'pix' | 'cartao' | 'boleto';
type Step = 'form' | 'payment' | 'success';

export function CheckoutModal({ open, cart, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [form, setForm] = useState({
    nome: '', email: '', telefone: '', cpf: '',
    cep: '', endereco: '', numero: '', complemento: '', senha: '',
  });
  const [pay, setPay] = useState<PayMethod>('pix');

  const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);

  if (!open) return null;

  function inp(key: keyof typeof form, label: string, placeholder: string, type = 'text', required = true) {
    return (
      <div key={key}>
        <label className="block text-[11px] font-semibold mb-1" style={{ color: '#9CA3AF' }}>{label}</label>
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          value={form[key]}
          onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          className="w-full h-9 px-3 rounded-lg text-sm outline-none transition-all"
          style={{ background: '#1F2937', border: '1px solid #374151', color: '#F9FAFB' }}
          onFocus={e => (e.target.style.borderColor = '#F97316')}
          onBlur={e => (e.target.style.borderColor = '#374151')}
        />
      </div>
    );
  }

  async function handleIdentify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const body: Record<string, string> = {
        email: form.email,
        fullName: form.nome,
        phone: form.telefone,
        cpf: form.cpf,
      };
      if (form.senha) body.password = form.senha;

      const res = await fetch(`${API}/api/v1/auth/checkout-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status === 401) {
        setNeedsPassword(true);
        toast.show({ title: 'Senha necessaria', message: 'Voce ja tem cadastro. Digite sua senha.', type: 'warning', icon: '🔒' });
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error('Erro na identificacao');

      const data = await res.json();
      sessionStorage.setItem('__fjt', data.accessToken ?? '');
      setStep('payment');
    } catch {
      toast.show({ title: 'Erro', message: 'Nao foi possivel prosseguir. Tente novamente.', type: 'error', icon: '❌' });
    } finally {
      setLoading(false);
    }
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const token = sessionStorage.getItem('__fjt') ?? '';
      const itemsDescription = cart.map(i => `${i.product.name} (${i.scale})`).join(', ');

      const res = await fetch(`${API}/api/v1/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          customerName: form.nome,
          customerEmail: form.email,
          customerPhone: form.telefone,
          address: `${form.endereco}, ${form.numero} ${form.complemento}`.trim(),
          zipCode: form.cep,
          items: itemsDescription,
          totalValue: subtotal,
          paymentMethod: pay,
          status: 'Aguardando pgto',
        }),
      });

      if (!res.ok) throw new Error('Erro ao registrar pedido');

      setStep('success');
      sessionStorage.removeItem('__fjt');
      setTimeout(() => { onSuccess(); setStep('form'); setNeedsPassword(false); }, 2500);
    } catch {
      toast.show({ title: 'Erro no pedido', message: 'Nao foi possivel registrar. Tente novamente.', type: 'error', icon: '❌' });
    } finally {
      setLoading(false);
    }
  }

  const payOptions: { id: PayMethod; icon: string; label: string; desc: string }[] = [
    { id: 'pix', icon: '⚡', label: 'PIX', desc: 'Aprovacao imediata' },
    { id: 'cartao', icon: '💳', label: 'Cartao', desc: 'Ate 12x sem juros' },
    { id: 'boleto', icon: '📄', label: 'Boleto', desc: 'Vence em 3 dias uteis' },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} />
      <div
        className="relative w-full md:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl md:rounded-2xl"
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
          <>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #374151' }}>
              <div className="flex items-center gap-3">
                <span className="text-lg">🛒</span>
                <h2 className="font-extrabold text-lg" style={{ color: '#F9FAFB' }}>
                  {step === 'form' ? 'Quem esta comprando?' : 'Entrega & Pagamento'}
                </h2>
              </div>
              <button type="button" onClick={onClose} className="text-sm px-3 py-1 rounded-lg" style={{ color: '#9CA3AF', background: '#1F2937' }}>
                Fechar
              </button>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: '1px solid #1F2937' }}>
              {(['form', 'payment'] as const).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{
                    background: step === s ? '#F97316' : (step === 'payment' && s === 'form') ? '#22C55E' : '#1F2937',
                    color: '#fff',
                    border: '1px solid ' + (step === s ? '#F97316' : (step === 'payment' && s === 'form') ? '#22C55E' : '#374151'),
                  }}>
                    {step === 'payment' && s === 'form' ? '✓' : i + 1}
                  </div>
                  <span className="text-xs" style={{ color: step === s ? '#F9FAFB' : '#6B7280' }}>
                    {s === 'form' ? 'Identificacao' : 'Entrega & Pgto'}
                  </span>
                  {i === 0 && <span className="text-xs" style={{ color: '#374151' }}>›</span>}
                </div>
              ))}
            </div>

            {/* Etapa 1 */}
            {step === 'form' && (
              <form onSubmit={handleIdentify} className="p-5 flex flex-col gap-3">
                <div className="flex justify-between py-2 px-3 rounded-lg text-sm" style={{ background: '#1F2937' }}>
                  <span style={{ color: '#9CA3AF' }}>{cart.length} item(s) no carrinho</span>
                  <span className="font-bold" style={{ color: '#F97316' }}>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {inp('nome', 'Nome completo', 'Ash Ketchum')}
                {inp('email', 'E-mail', 'ash@pokemon.com', 'email')}
                {inp('telefone', 'WhatsApp', '(11) 99999-0000', 'tel', false)}
                {inp('cpf', 'CPF', '000.000.000-00', 'text', false)}
                {needsPassword && (
                  <div>
                    <label className="block text-[11px] font-semibold mb-1" style={{ color: '#F97316' }}>
                      🔒 Voce ja tem cadastro! Digite sua senha:
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Sua senha"
                      value={form.senha}
                      onChange={e => setForm(p => ({ ...p, senha: e.target.value }))}
                      className="w-full h-9 px-3 rounded-lg text-sm outline-none"
                      style={{ background: '#1F2937', border: '1px solid #F97316', color: '#F9FAFB' }}
                    />
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl font-extrabold text-sm transition-all mt-1"
                  style={{ background: '#F97316', color: '#fff', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Verificando...' : 'Continuar →'}
                </button>
              </form>
            )}

            {/* Etapa 2 */}
            {step === 'payment' && (
              <form onSubmit={handlePayment} className="p-5 flex flex-col gap-4">
                <div className="p-3 rounded-xl" style={{ background: '#1F2937', border: '1px solid #374151' }}>
                  <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B7280' }}>Resumo</div>
                  {cart.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-1" style={{ borderBottom: i < cart.length - 1 ? '1px solid #374151' : 'none' }}>
                      <span style={{ color: '#D1D5DB' }}>{item.product.name} x{item.qty}</span>
                      <span className="font-bold" style={{ color: '#F97316' }}>R$ {(item.unitPrice * item.qty).toFixed(2).replace('.', ',')}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-base font-extrabold mt-2 pt-2" style={{ borderTop: '1px solid #374151' }}>
                    <span style={{ color: '#F9FAFB' }}>Total</span>
                    <span style={{ color: '#F97316' }}>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6B7280' }}>Endereco de Entrega</div>
                  {inp('cep', 'CEP', '00000-000')}
                  {inp('endereco', 'Endereco', 'Rua Pallet, 1')}
                  <div className="flex gap-2">
                    <div className="w-24">{inp('numero', 'Numero', '42')}</div>
                    <div className="flex-1">{inp('complemento', 'Complemento', 'Apto 3', 'text', false)}</div>
                  </div>
                </div>

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
                  className="w-full h-12 rounded-xl font-extrabold text-sm transition-all"
                  style={{ background: '#F97316', color: '#fff', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Processando...' : '🔒 Confirmar Pedido'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
