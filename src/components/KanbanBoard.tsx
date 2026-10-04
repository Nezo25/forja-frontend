import React, { useEffect, useState } from 'react';
import { fetchApi } from '../api/client';
import { toast } from './Toast';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

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
  customerPhone: string;
  customerEmail: string;
  totalAmount: number;
  kanbanColumn: KanbanColumn;
  tags: string[];
}

export function KanbanBoard() {
  const [board, setBoard] = useState<Record<KanbanColumn, OrderKanbanDTO[]>>({} as any);
  const [loading, setLoading] = useState(true);

  async function loadBoard() {
    try {
      const data = await fetchApi('/admin/orders/kanban');
      setBoard(data as any);
    } catch (e) {
      console.error(e);
      toast.info('Erro ao carregar kanban');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBoard();
  }, []);

  async function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = source.droppableId as KanbanColumn;
    const destCol = destination.droppableId as KanbanColumn;

    const sourceCards = Array.from(board[sourceCol] || []);
    const destCards = sourceCol === destCol ? sourceCards : Array.from(board[destCol] || []);

    const [movedCard] = sourceCards.splice(source.index, 1);
    
    if (sourceCol === destCol) {
      sourceCards.splice(destination.index, 0, movedCard);
      setBoard(prev => ({ ...prev, [sourceCol]: sourceCards }));
      return; // Ordering not persisted yet in backend, but optimistically updated locally
    } else {
      destCards.splice(destination.index, 0, movedCard);
      setBoard(prev => ({
        ...prev,
        [sourceCol]: sourceCards,
        [destCol]: destCards,
      }));

      try {
        await fetchApi(`/admin/orders/${movedCard.id}/kanban-column?column=${destCol}`, {
          method: 'PATCH'
        });
      } catch (e) {
        toast.info('Erro ao mover card');
        loadBoard(); // rollback
      }
    }
  }

  if (loading) {
    return <div className="text-center p-12 text-gray-500">Carregando Kanban...</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
        {COLUMNS.map((col) => {
          const cards = board[col.id] || [];
          return (
            <div key={col.id} className="min-w-[320px] max-w-[320px] bg-[#111827] border border-gray-800 rounded-xl flex flex-col snap-start shrink-0">
              <div className="p-3 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 rounded-t-xl">
                <span className="font-bold text-sm text-gray-300">{col.icon} {col.label}</span>
                <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full font-mono">{cards.length}</span>
              </div>
              
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-3 flex flex-col gap-3 min-h-[150px] max-h-[600px] overflow-y-auto transition-colors ${snapshot.isDraggingOver ? 'bg-gray-800/30' : ''}`}
                  >
                    {cards.map((card, idx) => (
                      <Draggable key={card.id.toString()} draggableId={card.id.toString()} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-gray-800 border ${snapshot.isDragging ? 'border-orange-500/50 shadow-lg shadow-orange-500/10' : 'border-gray-700'} p-3 rounded-lg flex flex-col gap-2 relative group hover:border-gray-600 transition-all`}
                            style={provided.draggableProps.style}
                          >
                            <div className="flex items-start justify-between">
                              <span className="text-orange-400 font-extrabold text-sm font-mono">{card.shortCode}</span>
                            </div>
                            
                            <div className="flex flex-col gap-0.5">
                              <span className="text-gray-300 text-sm font-medium">{card.customerName}</span>
                              {card.customerPhone && (
                                <a 
                                  href={`https://wa.me/${card.customerPhone.replace(/\D/g, '')}`} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-xs text-green-400 hover:underline flex items-center gap-1"
                                >
                                  📱 {card.customerPhone}
                                </a>
                              )}
                              {card.customerEmail && (
                                <span className="text-xs text-gray-500">📧 {card.customerEmail}</span>
                              )}
                            </div>
                            
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

                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700">
                              <span className="font-bold text-gray-200 text-sm">R$ {card.totalAmount.toFixed(2).replace('.', ',')}</span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {cards.length === 0 && !snapshot.isDraggingOver && (
                      <div className="text-center py-6 text-gray-600 text-xs italic">
                        Vazio
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
