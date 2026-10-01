import { useState } from 'react';
import type { CartItem } from '@/data/products';

interface Props {
  open: boolean;
  cart: CartItem[];
  onClose: () => void;
  onRemove: (idx: number) => void;
  onClear: () => void;
}

export function CartDrawer({ open, cart, onClose, onRemove, onClear }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);

  function handleCheckout() {
    if (!name.trim() || !phone.trim()) {
      alert('Por favor, preencha seu nome e WhatsApp para continuarmos.');
      return;
    }

    const wppNumber = '5511999999999'; // TO-DO: Colocar o número real da Forja do Chico

    let text = `🔥 *Novo Pedido - Forja do Chico* 🔥\n\n`;
    text += `👤 *Cliente:* ${name}\n`;
    text += `📱 *WhatsApp:* ${phone}\n\n`;
    text += `🛒 *Itens do Pedido:*\n`;

    cart.forEach((item, idx) => {
      text += `\n*${idx + 1}. ${item.product.name}*\n`;
      if (item.customized) {
        text += `   ✨ _Personalizado_\n`;
      } else {
        text += `   ⚡ _Compra Rápida_\n`;
      }
      text += `   ▪️ Escala/Tamanho: ${item.scale}\n`;
      text += `   ▪️ Acabamento: ${item.finish}\n`;
      text += `   ▪️ Qtd: ${item.qty} un.\n`;
      
      if (item.observations) {
        text += `   📝 Obs: ${item.observations}\n`;
      }
      
      text += `   💰 Valor Est.: R$ ${(item.unitPrice * item.qty).toFixed(2).replace('.', ',')}\n`;
    });

    text += `\n🧾 *Subtotal Estimado:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    text += `\n_Os valores acima são estimativas e serão confirmados durante o nosso atendimento!_`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${wppNumber}?text=${encoded}`, '_blank');
    onClear();
    onClose();
  }

  return (
    <>
      {open && <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />}
      <aside
        className={`fixed top-0 right-0 h-full z-[90] flex flex-col bg-[#111827] border-l border-gray-800 shadow-2xl transition-transform duration-300 w-full max-w-[420px] ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="font-extrabold text-lg text-white">🛒 Carrinho</h2>
          <button onClick={onClose} className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-4 opacity-50">🐉</div>
              <div className="text-sm font-medium">Sua forja está vazia.</div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                {cart.map((item, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-gray-800 border border-gray-700 relative group">
                    <img src={item.product.image} alt={item.product.name} className="w-20 h-24 object-cover rounded-lg shrink-0 bg-gray-900" />
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="flex justify-between items-start">
                        <div className="font-bold text-sm text-white leading-tight pr-6">{item.product.name}</div>
                        <button onClick={() => onRemove(i)} className="absolute top-3 right-3 text-gray-500 hover:text-red-400 transition-colors">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                      </div>
                      
                      {item.customized ? (
                        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wide">✨ Personalizado</span>
                      ) : (
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wide">⚡ Compra Rápida</span>
                      )}

                      <div className="text-xs text-gray-400 line-clamp-1">{item.scale} • {item.finish}</div>
                      {item.observations && (
                        <div className="text-[11px] text-gray-500 line-clamp-1 italic">Obs: {item.observations}</div>
                      )}
                      
                      <div className="flex items-end justify-between mt-auto">
                        <div className="text-xs text-gray-400">Qtd: {item.qty}</div>
                        <div className="font-extrabold text-sm text-orange-500">
                          R$ {(item.unitPrice * item.qty).toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Informações do Cliente */}
              <div className="mt-4 flex flex-col gap-3 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                <h3 className="font-semibold text-sm text-gray-300">Seus Dados</h3>
                <input
                  type="text"
                  placeholder="Nome Completo"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp com DDD"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t border-gray-800 bg-[#111827]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-gray-400">Subtotal Estimado</span>
              <span className="text-xl font-extrabold text-white">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full h-12 rounded-xl font-extrabold text-sm text-white bg-[#22c55e] hover:bg-[#16a34a] transition-all flex items-center justify-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              Finalizar pelo WhatsApp
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
