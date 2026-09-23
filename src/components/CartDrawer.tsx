import type { CartItem } from '@/data/products';

interface Props {
  open: boolean;
  cart: CartItem[];
  onClose: () => void;
  onRemove: (idx: number) => void;
  onCheckout: () => void;
}

export function CartDrawer({ open, cart, onClose, onRemove, onCheckout }: Props) {
  const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);

  return (
    <>
      {open && <div className="fixed inset-0 z-[80]" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose} />}
      <aside
        className="fixed top-0 right-0 h-full z-[90] flex flex-col transition-transform duration-300"
        style={{
          width: 'min(420px, 100vw)',
          background: '#111827',
          borderLeft: '1px solid #374151',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #374151' }}>
          <h2 className="font-extrabold text-lg" style={{ color: '#F9FAFB' }}>🛒 Carrinho</h2>
          <button onClick={onClose} className="text-sm px-3 py-1 rounded-lg transition-all" style={{ color: '#9CA3AF', background: '#1F2937' }}>Fechar</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
          {cart.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#6B7280' }}>
              <div className="text-4xl mb-3">📦</div>
              <div className="text-sm">Seu carrinho está vazio.</div>
            </div>
          ) : cart.map((item, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl" style={{ background: '#1F2937', border: '1px solid #374151' }}>
              <img src={item.product.image} alt={item.product.name} className="w-16 h-20 object-cover rounded-lg shrink-0" style={{ background: '#0B0F19' }} />
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="font-bold text-[14px] leading-tight truncate" style={{ color: '#F9FAFB' }}>{item.product.name}</div>
                <div className="text-[11px]" style={{ color: '#9CA3AF' }}>{item.scale} · {item.material} · {item.finish}</div>
                <div className="text-[11px]" style={{ color: '#6B7280' }}>Qtd: {item.qty}</div>
                <div className="font-extrabold text-[15px] mt-auto" style={{ color: '#F97316' }}>
                  R$ {(item.unitPrice * item.qty).toFixed(2).replace('.', ',')}
                </div>
              </div>
              <button onClick={() => onRemove(i)} className="text-[11px] self-start px-2 py-1 rounded transition-all" style={{ color: '#6B7280', background: '#111827' }}>✕</button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="p-5 flex flex-col gap-3" style={{ borderTop: '1px solid #374151' }}>
            <div className="flex items-center justify-between">
              <span className="font-semibold" style={{ color: '#9CA3AF' }}>Subtotal</span>
              <span className="text-xl font-extrabold" style={{ color: '#F9FAFB' }}>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full h-12 rounded-xl font-extrabold text-sm transition-all"
              style={{ background: '#F97316', color: '#fff' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#EA6A0A')}
              onMouseLeave={e => (e.currentTarget.style.background = '#F97316')}
            >
              Finalizar Pedido →
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
