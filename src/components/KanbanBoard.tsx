import React, { useEffect, useState } from 'react';
import { fetchApi } from '../api/client';
import { toast } from './Toast';

type KanbanColumn = 'NEW_LEAD' | 'NEGOTIATING_APPROVED' | 'SLICING_QUEUE' | 'PRINTING' | 'POST_PROCESSING' | 'READY_SHIPPED';

const COLUMNS: { id: KanbanColumn, label: string, icon: string }[] = [
  { id: 'NEW_LEAD', label: 'Novos Leads', icon: '📥' },
  { id: 'NEGOTIATING_APPROVED', label: 'Negociação/Aprovado', icon: '💬' },
  { id: 'SLICING_QUEUE', label: 'Fila 3D', icon: '⚙️' },
  { id: 'PRINTING', label: 'Imprimindo', icon: '🖨️' },
  { id: 'POST_PROCESSING', label: 'Pintura', icon: '🎨' },
  { id: 'READY_SHIPPED', label: 'Enviados', icon: '🚀' },
];

export interface OrderKanbanDTO {
  id: number;
  shortCode: string;
  customerName: string;
  totalAmount: number;
  kanbanColumn: KanbanColumn;
  tags: string[];
}

export function KanbanBoard() {
  const [board, setBoard] = useState<Record<KanbanColumn, OrderKanbanDTO[]>>({} as any);
  const [loading, setLoading] = useState(true);

  async function loadBoard() {
    try {
      setLoading(true);
      const data = await fetchApi('/admin/orders/kanban');
      setBoard(data);
    } catch (e) {
      console.error(e);
      toast.error('Erro ao carregar kanban');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBoard();
  }, []);

  async function moveCard(orderId: number, currentColumn: KanbanColumn, direction: 'prev' | 'next') {
    const currentIdx = COLUMNS.findIndex(c => c.id === currentColumn);
    const newIdx = direction === 'next' ? currentIdx + 1 : currentIdx - 1;
    if (newIdx < 0 || newIdx >= COLUMNS.length) return;
    
    const newColumn = COLUMNS[newIdx].id;
    
    try {
      await fetchApi(`/admin/orders/${orderId}/kanban-column?column=${newColumn}`, {
        method: 'PATCH'
      });
      loadBoard();
    } catch (e) {
      toast.error('Erro ao mover card');
    }
  }

  if (loading) {
    return <div className="text-center p-12 text-gray-500">Carregando Kanban...</div>;
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
      {COLUMNS.map((col, idx) => {
        const cards = board[col.id] || [];
        return (
          <div key={col.id} className="min-w-[320px] max-w-[320px] bg-[#111827] border border-gray-800 rounded-xl flex flex-col snap-start shrink-0">
            <div className="p-3 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 rounded-t-xl">
              <span className="font-bold text-sm text-gray-300">{col.icon} {col.label}</span>
              <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full font-mono">{cards.length}</span>
            </div>
            
            <div className="p-3 flex flex-col gap-3 min-h-[150px] overflow-y-auto max-h-[600px]">
              {cards.map(card => (
                <div key={card.id} className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-sm flex flex-col gap-2 relative group hover:border-gray-600 transition-colors">
                  
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-orange-400 font-extrabold text-sm font-mono">{card.shortCode}</span>
                    </div>
                  </div>
                  
                  {/* Customer */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300 text-sm font-medium">{card.customerName}</span>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {card.tags.map(t => {
                      let bg = 'bg-gray-700 text-gray-300';
                      if (t === '3D') bg = 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
                      else if (t === 'TCG') bg = 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
                      else if (t === 'PINTURA') bg = 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
                      else if (t === 'NOVO_CLIENTE') bg = 'bg-green-500/20 text-green-400 border border-green-500/30';
                      
                      return (
                        <span key={t} className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${bg}`}>
                          {t}
                        </span>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700">
                    <span className="font-bold text-gray-200 text-sm">R$ {card.totalAmount.toFixed(2).replace('.', ',')}</span>
                    
                    <div className="flex gap-1">
                      <button 
                        disabled={idx === 0}
                        onClick={() => moveCard(card.id, col.id, 'prev')}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                      </button>
                      <button 
                        disabled={idx === COLUMNS.length - 1}
                        onClick={() => moveCard(card.id, col.id, 'next')}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {cards.length === 0 && (
                <div className="text-center py-6 text-gray-600 text-xs italic">
                  Vazio
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
