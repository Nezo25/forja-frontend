import { OrderKanbanDTO } from './KanbanBoard';

interface OrderDetailModalProps {
  order: OrderKanbanDTO;
  onClose: () => void;
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-extrabold text-gray-100 flex items-center gap-2">
              🔥 Ordem de Serviço <span className="text-orange-400">{order.shortCode}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">Detalhes completos, fila 3D e filamentos</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          
          {/* Cliente Info */}
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 flex flex-col gap-2">
            <h3 className="text-sm font-bold text-gray-300">👤 Cliente</h3>
            <div className="text-sm text-gray-100 font-semibold">{order.customerName}</div>
            {order.customerEmail && <div className="text-xs text-gray-400">📧 {order.customerEmail}</div>}
            {order.customerPhone && (
              <a 
                href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`}
                target="_blank" rel="noreferrer"
                className="text-xs text-green-400 hover:underline flex items-center gap-1 mt-1"
              >
                📱 Abrir WhatsApp: {order.customerPhone}
              </a>
            )}
          </div>

          {/* Produção e Filamentos */}
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
            <h3 className="text-sm font-bold text-gray-300 mb-3">⚙️ Status de Produção</h3>
            <div className="text-xs text-gray-400 mb-2">
              <span className="font-semibold text-gray-200">Etapa Atual:</span> {order.kanbanColumn}
            </div>
            
            <div className="mt-4 p-4 border border-dashed border-gray-600 rounded-lg text-center text-sm text-gray-500">
              [Lista de peças fatiadas e filamentos alocados aparecerão aqui]
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-bold bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            >
              Fechar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
