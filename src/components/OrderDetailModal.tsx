import { OrderKanbanDTO } from './KanbanBoard';
import { toast } from '@/components/Toast';
import { fetchApi } from '@/api/client';

interface OrderDetailModalProps {
  order: OrderKanbanDTO;
  onClose: () => void;
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  async function handleDelete() {
    if (!confirm('Deseja excluir esta OS?')) return;
    try {
      await fetchApi(`/admin/orders/${order.id}`, { method: 'DELETE' });
      toast.show({ title: 'Sucesso', message: 'OS Excluída.', type: 'success' });
      window.dispatchEvent(new Event('forja_orders_updated'));
      onClose();
    } catch (e: any) {
      toast.show({ title: 'Erro', message: e.message || 'Falha ao excluir.', type: 'error' });
    }
  }

  async function handleReject() {
    const reason = window.prompt("Motivo da rejeição:");
    if (!reason) return;
    try {
      await fetchApi(`/admin/orders/${order.id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({ rejectionReason: reason })
      });
      toast.show({ title: 'Sucesso', message: 'Pedido rejeitado/cancelado.', type: 'success' });
      window.dispatchEvent(new Event('forja_orders_updated'));
      onClose();
    } catch (e) {
      toast.show({ title: 'Erro', message: 'Falha ao rejeitar.', type: 'error' });
    }
  }

  async function handleApprove() {
    try {
      await fetchApi(`/admin/orders/${order.id}/approve`, { method: 'PATCH' });
      toast.show({ title: 'Sucesso', message: 'Pedido aprovado!', type: 'success' });
      window.dispatchEvent(new Event('forja_orders_updated'));
      onClose();
    } catch (e) {
      toast.show({ title: 'Erro', message: 'Falha ao aprovar.', type: 'error' });
    }
  }

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
            
                        <div className="mt-4 flex flex-col gap-2">
              {order.items && order.items.map((item: any, idx: number) => (
                <div key={idx} className="p-3 bg-gray-900 border border-gray-700 rounded-lg flex flex-col gap-1 text-sm">
                  <div className="font-bold text-gray-200">{item.quantity}x {item.itemName}</div>
                  <div className="text-xs text-gray-400 flex gap-4">
                    <span>Acabamento: <span className="text-gray-300">{item.finishType}</span></span>
                    <span>Filamento: <span className="text-gray-300">{item.filamentColor}</span></span>
                  </div>
                </div>
              ))}
              {(!order.items || order.items.length === 0) && (
                <div className="p-4 border border-dashed border-gray-600 rounded-lg text-center text-sm text-gray-500">
                  Nenhum item alocado
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between mt-2 pt-4 border-t border-gray-700/50">
            <button 
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg text-sm font-bold bg-red-900/50 text-red-400 hover:bg-red-900 transition-colors"
            >
              Excluir OS
            </button>
            <div className="flex gap-3">
              <button 
                onClick={handleReject}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-orange-900/50 text-orange-400 hover:bg-orange-900 transition-colors"
              >
                Rejeitar / Cancelar
              </button>
              <button 
                onClick={handleApprove}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-green-700 text-white hover:bg-green-600 transition-colors"
              >
                Aprovar Pedido
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
