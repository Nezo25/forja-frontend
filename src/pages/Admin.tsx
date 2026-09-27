import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { Product, Category, PokemonType } from '@/data/products';
import { TypeBadge } from '@/components/TypeBadge';
import { toast } from '@/components/Toast';
import {
  getStoredProducts,
  saveProduct,
  deleteProduct,
  toggleProductActive,
  updateProductPrice,
  getStoredFilaments,
  saveFilament,
  updateFilamentStock,
  getStoredOrders,
  updateOrderStatus,
  deleteOrder,
  getStoredQuotes,
  updateQuote,
  deleteQuote,
  fileToBase64,
  type Order,
  type Quote,
  type Filament
} from '@/services/storage';

type Section = 'catalogo' | 'pedidos' | 'orcamentos' | 'estoque' | 'precos';

const NAV: { id: Section; icon: string; label: string }[] = [
  { id: 'catalogo', icon: '📦', label: 'Catálogo' },
  { id: 'pedidos', icon: '🛒', label: 'Pedidos' },
  { id: 'orcamentos', icon: '📐', label: 'Orçamentos STL' },
  { id: 'estoque', icon: '🧵', label: 'Estoque Filamento' },
  { id: 'precos', icon: '💰', label: 'Ajuste de Preços' },
];

const CHART_DATA = [
  { mes: 'Abr', vendas: 4800 },
  { mes: 'Mai', vendas: 6200 },
  { mes: 'Jun', vendas: 5400 },
  { mes: 'Jul', vendas: 8100 },
  { mes: 'Ago', vendas: 7600 },
  { mes: 'Set', vendas: 9200 },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  'Em impressão':      { bg: 'rgba(234,179,8,0.15)', text: '#EAB308' },
  'Aguardando pgto':   { bg: 'rgba(249,115,22,0.15)', text: '#F97316' },
  'Entregue':          { bg: 'rgba(34,197,94,0.15)', text: '#22C55E' },
  'Enviado':           { bg: 'rgba(96,165,250,0.15)', text: '#60A5FA' },
  'Aguardando análise':{ bg: 'rgba(249,115,22,0.15)', text: '#F97316' },
  'Orçamento enviado': { bg: 'rgba(96,165,250,0.15)', text: '#60A5FA' },
  'Aprovado':          { bg: 'rgba(34,197,94,0.15)', text: '#22C55E' },
  'Recusado':          { bg: 'rgba(239,68,68,0.15)', text: '#EF4444' },
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? { bg: '#1F2937', text: '#9CA3AF' };
  return <span className="px-2 py-0.5 rounded text-[11px] font-semibold" style={{ background: c.bg, color: c.text }}>{status}</span>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold mb-1" style={{ color: '#9CA3AF' }}>{label}</label>
      {children}
    </div>
  );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full h-9 px-3 rounded-lg text-sm outline-none transition-colors"
      style={{ background: '#111827', border: '1px solid #374151', color: '#F9FAFB' }}
      onFocus={e => (e.target.style.borderColor = '#F97316')}
      onBlur={e => (e.target.style.borderColor = '#374151')}
    />
  );
}

// ------------------- MODAL: PRODUTO -------------------
function ProductModal({ onClose, onSave, initialData }: { onClose: () => void; onSave: (p: Product) => void; initialData?: Product }) {
  const [form, setForm] = useState({
    name: initialData?.name || '', 
    category: initialData?.category || 'Figures Pokémon', 
    types: initialData?.types?.join(', ') || '',
    scale: initialData?.scales?.[0] || '1:10', 
    material: initialData?.materials?.[0] || 'PLA', 
    printTimeH: initialData?.printTimeH?.toString() || '14', 
    filamentG: initialData?.filamentG?.toString() || '320', 
    basePrice: initialData?.basePrice?.toString() || '149', 
    image: initialData?.image || '', 
    active: initialData ? initialData.active : true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) {
      try {
        setIsProcessingImage(true);
        const b64 = await fileToBase64(e.target.files[0]);
        setForm(f => ({ ...f, image: b64 }));
      } catch (err) {
        console.error('Erro ao processar imagem:', err);
      } finally {
        setIsProcessingImage(false);
      }
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;

    setIsSaving(true);

    // Micro delay agradável para o usuário ver o feedback "Salvando no Banco de Dados..." que ele gostou
    await new Promise(r => setTimeout(r, 450));

    try {
      const saved = await saveProduct({
        id: initialData?.id,
        name: form.name.trim(),
        category: form.category as Category,
        types: form.types.split(',').map(t => t.trim()).filter(Boolean) as PokemonType[],
        scales: [form.scale as any],
        materials: [form.material as any],
        basePrice: parseFloat(form.basePrice) || 0,
        printTimeH: parseInt(form.printTimeH) || 0,
        filamentG: parseInt(form.filamentG) || 0,
        image: form.image.trim() || 'https://placehold.co/600x700/1F2937/F97316?text=Figure',
        active: form.active,
      }, initialData?.id);

      // Notificação no canto superior direito
      toast.show({
        title: initialData ? 'Produto atualizado!' : 'Produto salvo no Banco de Dados!',
        message: `Figure "${saved.name}" foi salva com sucesso no catálogo.`,
        type: 'success',
        icon: '💾',
      });

      onSave(saved);
      onClose(); // Tela de salvamento fecha automaticamente
    } catch (err) {
      console.error(err);
      toast.show({
        title: 'Erro ao salvar',
        message: 'Não foi possível salvar os dados do produto.',
        type: 'error',
        icon: '⚠️'
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }} />
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl" style={{ background: '#111827', border: '1px solid #374151' }} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSave}>
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-[#111827]/90 backdrop-blur-md" style={{ borderBottom: '1px solid #374151' }}>
            <div>
              <h2 className="font-extrabold text-lg" style={{ color: '#F9FAFB' }}>{initialData ? 'Editar Produto' : 'Nova Figure / Produto'}</h2>
              <p className="text-xs text-gray-400">Preencha as especificações da peça</p>
            </div>
            <button type="button" onClick={onClose} className="text-sm px-3 py-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors" style={{ background: '#1F2937' }}>✕</button>
          </div>

          <div className="p-5 flex flex-col gap-4">
            <Field label="Nome do produto *">
              <Input required placeholder="Ex: Charizard Stance Gigantamax" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Categoria">
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))} className="w-full h-9 px-3 rounded-lg text-sm outline-none" style={{ background: '#111827', border: '1px solid #374151', color: '#F9FAFB' }}>
                  {['Figures Pokémon','Dioramas','Chibis','Acessórios'].map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Tipos (separados por vírgula)">
                <Input placeholder="Fogo, Dragão" value={form.types} onChange={e => setForm(f => ({ ...f, types: e.target.value }))} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Escala">
                <select value={form.scale} onChange={e => setForm(f => ({ ...f, scale: e.target.value as any }))} className="w-full h-9 px-3 rounded-lg text-sm outline-none" style={{ background: '#111827', border: '1px solid #374151', color: '#F9FAFB' }}>
                  {['1:10','1:1','Chibi','Diorama'].map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Material">
                <select value={form.material} onChange={e => setForm(f => ({ ...f, material: e.target.value as any }))} className="w-full h-9 px-3 rounded-lg text-sm outline-none" style={{ background: '#111827', border: '1px solid #374151', color: '#F9FAFB' }}>
                  {['PLA','Resina'].map(m => <option key={m}>{m}</option>)}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Field label="Preço base (R$) *"><Input required type="number" placeholder="149" value={form.basePrice} onChange={e => setForm(f => ({ ...f, basePrice: e.target.value }))} /></Field>
              <Field label="Tempo impressão (h)"><Input type="number" placeholder="18" value={form.printTimeH} onChange={e => setForm(f => ({ ...f, printTimeH: e.target.value }))} /></Field>
              <Field label="Filamento (g)"><Input type="number" placeholder="320" value={form.filamentG} onChange={e => setForm(f => ({ ...f, filamentG: e.target.value }))} /></Field>
            </div>

            <Field label="URL da Imagem">
              <Input 
                placeholder="https://exemplo.com/imagem.jpg" 
                value={form.image.startsWith('data:') ? '' : form.image} 
                onChange={e => setForm(f => ({ ...f, image: e.target.value }))} 
              />
            </Field>

            <Field label="Ou selecione um arquivo do computador">
              <div className="flex flex-col gap-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1F2937] file:text-[#F9FAFB] hover:file:bg-[#374151] cursor-pointer"
                />
                {isProcessingImage && <span className="text-xs text-orange-400 animate-pulse">Processando imagem...</span>}
              </div>
            </Field>

            {form.image && (
              <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#1F2937]/60 border border-[#374151]">
                <img src={form.image} alt="Preview" className="w-14 h-14 object-cover rounded-md border border-gray-700 bg-black/40" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-gray-200">Prévia da imagem</span>
                  <span className="text-[11px] text-gray-400 truncate max-w-[280px]">Pronta para ser salva</span>
                </div>
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 rounded accent-orange-500 cursor-pointer" />
              <span className="text-sm font-semibold" style={{ color: '#D1D5DB' }}>Produto ativo na vitrine da loja</span>
            </label>

            <button 
              disabled={isSaving || isProcessingImage} 
              type="submit" 
              className="w-full h-12 rounded-xl font-extrabold text-sm mt-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-950/40 hover:opacity-90 active:scale-[0.99]" 
              style={{ background: '#F97316', color: '#fff' }}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin text-lg">⏳</span> Salvando no Banco de Dados...
                </>
              ) : (
                <>{initialData ? "Atualizar Produto" : "Salvar Produto"} 💾</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ------------------- MODAL: FILAMENTO -------------------
function FilamentModal({ onClose, onSave }: { onClose: () => void; onSave: (f: Filament) => void }) {
  const [form, setForm] = useState({ color: '', material: 'PLA', stockG: '1000', minStockG: '300' });
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.color.trim()) return;

    setIsSaving(true);
    await new Promise(r => setTimeout(r, 400));

    try {
      const saved = await saveFilament({
        color: form.color.trim(),
        material: form.material.trim(),
        stockGrams: parseFloat(form.stockG) || 0,
        minStockGrams: parseFloat(form.minStockG) || 300
      });

      toast.show({
        title: 'Filamento salvo no Estoque!',
        message: `Bobina "${saved.color} (${saved.material})" foi adicionada com sucesso.`,
        type: 'success',
        icon: '🧵',
      });

      onSave(saved);
      onClose(); // Fecha tela automaticamente
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }} />
      <div className="relative w-full max-w-sm overflow-y-auto rounded-2xl shadow-2xl" style={{ background: '#111827', border: '1px solid #374151' }} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSave}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #374151' }}>
            <div>
              <h2 className="font-extrabold text-lg" style={{ color: '#F9FAFB' }}>Nova Bobina de Filamento</h2>
              <p className="text-xs text-gray-400">Cadastrar no estoque de matéria-prima</p>
            </div>
            <button type="button" onClick={onClose} className="text-sm px-3 py-1 rounded-lg text-gray-400 hover:text-white" style={{ background: '#1F2937' }}>✕</button>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <Field label="Cor *"><Input required placeholder="Ex: Vermelho Charizard" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} /></Field>
            <Field label="Material *">
              <select value={form.material} onChange={e => setForm(f => ({ ...f, material: e.target.value }))} className="w-full h-9 px-3 rounded-lg text-sm outline-none" style={{ background: '#111827', border: '1px solid #374151', color: '#F9FAFB' }}>
                {['PLA','Resina','PETG','ABS'].map(m => <option key={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Estoque Atual (g) *"><Input required type="number" placeholder="1000" value={form.stockG} onChange={e => setForm(f => ({ ...f, stockG: e.target.value }))} /></Field>
            <Field label="Mínimo Recomendado (g) *"><Input required type="number" placeholder="300" value={form.minStockG} onChange={e => setForm(f => ({ ...f, minStockG: e.target.value }))} /></Field>
            
            <button 
              disabled={isSaving} 
              type="submit" 
              className="w-full h-11 rounded-xl font-extrabold text-sm mt-1 transition-all flex items-center justify-center gap-2" 
              style={{ background: '#F97316', color: '#fff' }}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin text-sm">⏳</span> Salvando no Banco de Dados...
                </>
              ) : (
                <>Salvar Filamento 💾</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ------------------- MODAL: RESPONDER ORÇAMENTO -------------------
function QuoteModal({ quote, onClose, onSave }: { quote: Quote; onClose: () => void; onSave: (updated: Quote) => void }) {
  const [status, setStatus] = useState(quote.status || 'Orçamento enviado');
  const [price, setPrice] = useState(quote.precoEstimado?.toString() || '180');
  const [notes, setNotes] = useState(quote.detalhes || '');
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 400));

    const updated: Quote = {
      ...quote,
      status,
      precoEstimado: parseFloat(price) || undefined,
      detalhes: notes,
    };

    updateQuote(quote.id, updated);

    toast.show({
      title: 'Orçamento respondido com sucesso!',
      message: `Status de "${quote.cliente}" atualizado para "${status}".`,
      type: 'success',
      icon: '📐',
    });

    onSave(updated);
    onClose(); // Fecha tela automaticamente
    setIsSaving(false);
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }} />
      <div className="relative w-full max-w-md overflow-y-auto rounded-2xl shadow-2xl" style={{ background: '#111827', border: '1px solid #374151' }} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSave}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #374151' }}>
            <div>
              <h2 className="font-extrabold text-lg" style={{ color: '#F9FAFB' }}>Responder Orçamento {quote.id}</h2>
              <p className="text-xs text-gray-400">Cliente: {quote.cliente}</p>
            </div>
            <button type="button" onClick={onClose} className="text-sm px-3 py-1 rounded-lg text-gray-400 hover:text-white" style={{ background: '#1F2937' }}>✕</button>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <div className="p-3 rounded-lg bg-gray-900 border border-gray-800 text-xs flex flex-col gap-1">
              <div><strong className="text-gray-300">Arquivo:</strong> <span className="font-mono text-orange-400">{quote.arquivo}</span></div>
              {quote.contato && <div><strong className="text-gray-300">Contato:</strong> {quote.contato}</div>}
              {quote.escala && <div><strong className="text-gray-300">Escala:</strong> {quote.escala}</div>}
              {quote.acabamento && <div><strong className="text-gray-300">Acabamento:</strong> {quote.acabamento}</div>}
            </div>

            <Field label="Status do Orçamento">
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full h-9 px-3 rounded-lg text-sm outline-none" style={{ background: '#111827', border: '1px solid #374151', color: '#F9FAFB' }}>
                {['Aguardando análise','Orçamento enviado','Aprovado','Recusado'].map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>

            <Field label="Valor Estimado da Impressão (R$)">
              <Input type="number" placeholder="180" value={price} onChange={e => setPrice(e.target.value)} />
            </Field>

            <Field label="Observações técnicas ou para o cliente">
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Ex: Tempo estimado 14h, filamento cinza primer incluído..."
                className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                style={{ background: '#111827', border: '1px solid #374151', color: '#F9FAFB' }}
              />
            </Field>

            <button 
              disabled={isSaving} 
              type="submit" 
              className="w-full h-11 rounded-xl font-extrabold text-sm mt-1 transition-all flex items-center justify-center gap-2" 
              style={{ background: '#F97316', color: '#fff' }}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin text-sm">⏳</span> Salvando Resposta...
                </>
              ) : (
                <>Salvar Resposta do Orçamento 💾</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ------------------- PRINCIPAL: ADMIN DASHBOARD -------------------
export default function Admin() {
  const [section, setSection] = useState<Section>('catalogo');
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orcamentos, setOrcamentos] = useState<Quote[]>([]);
  const [filamentos, setFilamentos] = useState<Filament[]>([]);

  const [showNewModal, setShowNewModal] = useState(false);
  const [showNewFilamentModal, setShowNewFilamentModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [answeringQuote, setAnsweringQuote] = useState<Quote | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Carrega e sincroniza dados locais e remotos
  useEffect(() => {
    setCatalog(getStoredProducts());
    setOrders(getStoredOrders());
    setOrcamentos(getStoredQuotes());
    setFilamentos(getStoredFilaments());

    const handleStorageUpdate = () => {
      setCatalog(getStoredProducts());
      setOrders(getStoredOrders());
      setOrcamentos(getStoredQuotes());
      setFilamentos(getStoredFilaments());
    };

    window.addEventListener('forja_products_updated', handleStorageUpdate);
    window.addEventListener('forja_orders_updated', handleStorageUpdate);
    window.addEventListener('forja_quotes_updated', handleStorageUpdate);
    window.addEventListener('forja_filaments_updated', handleStorageUpdate);

    return () => {
      window.removeEventListener('forja_products_updated', handleStorageUpdate);
      window.removeEventListener('forja_orders_updated', handleStorageUpdate);
      window.removeEventListener('forja_quotes_updated', handleStorageUpdate);
      window.removeEventListener('forja_filaments_updated', handleStorageUpdate);
    };
  }, []);

  // Catálogo: Toggle Ativo / Pausado
  function handleToggleActive(p: Product) {
    const isNowActive = toggleProductActive(p.id);
    setCatalog(prev => prev.map(x => x.id === p.id ? { ...x, active: isNowActive } : x));
    toast.show({
      title: isNowActive ? 'Figure ativada!' : 'Figure pausada!',
      message: `"${p.name}" foi ${isNowActive ? 'ativada na loja' : 'pausada'}.`,
      type: 'info',
      icon: isNowActive ? '▶️' : '⏸️'
    });
  }

  // Catálogo: Deletar Figure
  function handleDeleteProduct(p: Product) {
    if (confirm(`Tem certeza que deseja deletar "${p.name}" do catálogo?`)) {
      deleteProduct(p.id);
      setCatalog(prev => prev.filter(x => x.id !== p.id));
      toast.show({
        title: 'Produto excluído!',
        message: `Figure "${p.name}" foi removida do catálogo.`,
        type: 'info',
        icon: '🗑️'
      });
    }
  }

  // Pedidos: Alterar Status
  function handleOrderStatusChange(o: Order, newStatus: string) {
    updateOrderStatus(o.id, newStatus);
    setOrders(prev => prev.map(x => x.id === o.id ? { ...x, status: newStatus } : x));
    toast.show({
      title: 'Status do Pedido atualizado!',
      message: `Pedido ${o.id} alterado para "${newStatus}".`,
      type: 'success',
      icon: '🛒'
    });
  }

  // Pedidos: Deletar
  function handleDeleteOrder(o: Order) {
    if (confirm(`Deletar pedido ${o.id}?`)) {
      deleteOrder(o.id);
      setOrders(prev => prev.filter(x => x.id !== o.id));
      toast.show({
        title: 'Pedido removido!',
        message: `Pedido ${o.id} foi removido com sucesso.`,
        type: 'info',
        icon: '🗑️'
      });
    }
  }

  // Orçamentos: Deletar
  function handleDeleteQuote(q: Quote) {
    if (confirm(`Deletar orçamento ${q.id}?`)) {
      deleteQuote(q.id);
      setOrcamentos(prev => prev.filter(x => x.id !== q.id));
      toast.show({
        title: 'Orçamento removido!',
        message: `Orçamento ${q.id} foi excluído.`,
        type: 'info',
        icon: '🗑️'
      });
    }
  }

  // Estoque: Ajuste Rápido de Filamento
  function handleFilamentStockChange(f: Filament, delta: number) {
    const newStock = Math.max(0, f.stockGrams + delta);
    updateFilamentStock(f.id, newStock);
    setFilamentos(prev => prev.map(x => x.id === f.id ? { ...x, stockGrams: newStock } : x));
    toast.show({
      title: 'Estoque de Filamento atualizado!',
      message: `Bobina "${f.color}" ajustada para ${newStock}g.`,
      type: 'info',
      icon: '🧵'
    });
  }

  // Preços: Salvar Preço
  function handleSavePrice(p: Product, newPrice: number) {
    updateProductPrice(p.id, newPrice);
    setCatalog(prev => prev.map(x => x.id === p.id ? { ...x, basePrice: newPrice } : x));
    toast.show({
      title: 'Preço salvo no Banco de Dados!',
      message: `Preço de "${p.name}" atualizado para R$ ${newPrice.toFixed(2)}.`,
      type: 'success',
      icon: '💰'
    });
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#0B0F19' }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 md:hidden" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen z-50 md:z-auto flex-shrink-0 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{ width: 220, background: '#111827', borderRight: '1px solid #1F2937' }}
      >
        <div className="flex items-center gap-2.5 px-4 py-5" style={{ borderBottom: '1px solid #1F2937' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shadow-lg shadow-orange-950/50" style={{ background: 'linear-gradient(135deg,#F97316,#EA580C)' }}>🔩</div>
          <div>
            <div className="font-extrabold text-[14px]" style={{ color: '#F9FAFB' }}>Forja Admin</div>
            <div className="text-[10px] text-orange-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Sincronizado
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1.5">
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => { setSection(n.id); setSidebarOpen(false); }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-left transition-all w-full cursor-pointer"
              style={section === n.id
                ? { background: 'rgba(249,115,22,0.14)', color: '#F97316', border: '1px solid rgba(249,115,22,0.25)' }
                : { color: '#9CA3AF', background: 'transparent', border: '1px solid transparent' }
              }
            >
              <span className="text-base">{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>

        <div className="p-3" style={{ borderTop: '1px solid #1F2937' }}>
          <Link to="/" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all hover:bg-gray-800/60" style={{ color: '#9CA3AF' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F97316')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
          >
            ← Voltar para a Loja
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 md:px-8 py-4 sticky top-0 z-30 shadow-md backdrop-blur-md" style={{ borderBottom: '1px solid #1F2937', background: 'rgba(17, 24, 39, 0.95)' }}>
          <button onClick={() => setSidebarOpen(true)} className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: '#1F2937', color: '#9CA3AF' }}>☰</button>
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{NAV.find(n => n.id === section)?.icon}</span>
            <h1 className="font-extrabold text-lg" style={{ color: '#F9FAFB' }}>
              {NAV.find(n => n.id === section)?.label}
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {section === 'catalogo' && (
              <button 
                onClick={() => setShowNewModal(true)} 
                className="h-9 px-4 rounded-lg text-sm font-bold flex items-center gap-2 transition-all hover:opacity-90 shadow-md shadow-orange-950/40 cursor-pointer" 
                style={{ background: '#F97316', color: '#fff' }}
              >
                + Nova Figure
              </button>
            )}
            {section === 'estoque' && (
              <button 
                onClick={() => setShowNewFilamentModal(true)} 
                className="h-9 px-4 rounded-lg text-sm font-bold flex items-center gap-2 transition-all hover:opacity-90 shadow-md shadow-orange-950/40 cursor-pointer" 
                style={{ background: '#F97316', color: '#fff' }}
              >
                + Nova Bobina
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-auto">

          {/* ── CATÁLOGO ── */}
          {section === 'catalogo' && (
            <div className="flex flex-col gap-4">
              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
                {[
                  { label: 'Total de figures', value: catalog.length, icon: '📦' },
                  { label: 'Ativos', value: catalog.filter(p => p.active).length, icon: '✅' },
                  { label: 'Pausados', value: catalog.filter(p => !p.active).length, icon: '⏸️' },
                  { label: 'Categorias', value: new Set(catalog.map(p => p.category)).size, icon: '🗂️' },
                ].map(k => (
                  <div key={k.label} className="p-4 rounded-xl flex flex-col gap-1" style={{ background: '#1F2937', border: '1px solid #374151' }}>
                    <div className="text-xl">{k.icon}</div>
                    <div className="text-2xl font-extrabold" style={{ color: '#F9FAFB' }}>{k.value}</div>
                    <div className="text-[11px]" style={{ color: '#9CA3AF' }}>{k.label}</div>
                  </div>
                ))}
              </div>

              {/* Table */}
              <div className="rounded-xl overflow-hidden shadow-xl" style={{ border: '1px solid #374151' }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: '#1F2937', borderBottom: '1px solid #374151' }}>
                        {['Produto','Categoria','Tipos','Escalas','Tempo','Filamento','Status','Ações'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#6B7280' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {catalog.map((p, i) => (
                        <tr key={p.id} style={{ background: i % 2 === 0 ? '#111827' : '#161B24', borderBottom: '1px solid #1F2937' }}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={p.image} alt={p.name} className="w-10 h-12 object-cover rounded-lg shrink-0 border border-gray-700 bg-black/40" />
                              <div>
                                <div className="font-semibold text-sm" style={{ color: '#F9FAFB' }}>{p.name}</div>
                                <div className="text-[10px] font-mono text-gray-500">{p.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[12px]" style={{ color: '#D1D5DB' }}>{p.category}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {p.types?.map(t => <TypeBadge key={t} type={t} />)}
                              {(!p.types || p.types.length === 0) && <span className="text-[11px]" style={{ color: '#6B7280' }}>—</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {p.scales?.map(s => (
                                <span key={s} className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: '#1F2937', color: '#9CA3AF', border: '1px solid #374151' }}>{s}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-[12px]" style={{ color: '#9CA3AF' }}>{p.printTimeH}h</td>
                          <td className="px-4 py-3 font-mono text-[12px]" style={{ color: '#9CA3AF' }}>{p.filamentG}g</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold" style={p.active ? { background: 'rgba(34,197,94,0.15)', color: '#22C55E' } : { background: '#1F2937', color: '#6B7280' }}>
                              {p.active ? 'Ativo' : 'Pausado'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all hover:bg-[#374151] cursor-pointer"
                                style={{ background: '#1F2937', border: '1px solid #374151', color: '#60A5FA' }}
                              >
                                ✏️ Editar
                              </button>
                              <button
                                onClick={() => handleToggleActive(p)}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all hover:bg-gray-800 cursor-pointer"
                                style={{ background: '#1F2937', border: '1px solid #374151', color: '#9CA3AF' }}
                              >
                                {p.active ? '⏸ Pausar' : '▶ Ativar'}
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p)}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all hover:bg-red-900/50 cursor-pointer"
                                style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#EF4444' }}
                              >
                                🗑 Deletar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── PEDIDOS ── */}
          {section === 'pedidos' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
                {[
                  { label: 'Total cadastrado', value: orders.length, icon: '📋' },
                  { label: 'Em impressão', value: orders.filter(o => o.status === 'Em impressão').length, icon: '🖨️' },
                  { label: 'Enviados', value: orders.filter(o => o.status === 'Enviado').length, icon: '📬' },
                  { label: 'Entregues', value: orders.filter(o => o.status === 'Entregue').length, icon: '✅' },
                ].map(k => (
                  <div key={k.label} className="p-4 rounded-xl" style={{ background: '#1F2937', border: '1px solid #374151' }}>
                    <div className="text-xl mb-1">{k.icon}</div>
                    <div className="text-2xl font-extrabold" style={{ color: '#F97316' }}>{k.value}</div>
                    <div className="text-[11px]" style={{ color: '#9CA3AF' }}>{k.label}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="p-5 rounded-xl shadow-xl" style={{ background: '#1F2937', border: '1px solid #374151' }}>
                <div className="text-sm font-bold mb-4" style={{ color: '#F9FAFB' }}>Vendas mensais da Forja (R$)</div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={CHART_DATA} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis dataKey="mes" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
                      labelStyle={{ color: '#F9FAFB' }}
                      itemStyle={{ color: '#F97316' }}
                      formatter={(v) => [`R$ ${Number(v).toLocaleString('pt-BR')}`, 'Vendas']}
                    />
                    <Bar dataKey="vendas" fill="#F97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl overflow-hidden shadow-xl" style={{ border: '1px solid #374151' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: '#1F2937', borderBottom: '1px solid #374151' }}>
                      {['Pedido','Cliente','Produto','Data','Valor','Status','Ações'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#6B7280' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o, i) => (
                      <tr key={o.id} style={{ background: i % 2 === 0 ? '#111827' : '#161B24', borderBottom: '1px solid #1F2937' }}>
                        <td className="px-4 py-3 font-mono text-[12px] font-bold" style={{ color: '#F97316' }}>{o.id}</td>
                        <td className="px-4 py-3 font-medium" style={{ color: '#F9FAFB' }}>{o.cliente}</td>
                        <td className="px-4 py-3 text-sm" style={{ color: '#D1D5DB' }}>{o.produto}</td>
                        <td className="px-4 py-3 font-mono text-[12px]" style={{ color: '#9CA3AF' }}>{o.data}</td>
                        <td className="px-4 py-3 font-bold" style={{ color: '#F9FAFB' }}>R$ {o.valor}</td>
                        <td className="px-4 py-3">
                          <select
                            value={o.status}
                            onChange={e => handleOrderStatusChange(o, e.target.value)}
                            className="text-xs px-2.5 py-1 rounded-lg font-semibold outline-none cursor-pointer border"
                            style={{
                              background: '#1F2937',
                              borderColor: '#374151',
                              color: STATUS_COLORS[o.status]?.text || '#F9FAFB'
                            }}
                          >
                            {['Aguardando pgto','Em impressão','Enviado','Entregue'].map(st => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteOrder(o)}
                            className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all hover:bg-red-900/50 cursor-pointer"
                            style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#EF4444' }}
                          >
                            🗑 Deletar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ORÇAMENTOS STL ── */}
          {section === 'orcamentos' && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl overflow-hidden shadow-xl" style={{ border: '1px solid #374151' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: '#1F2937', borderBottom: '1px solid #374151' }}>
                      {['ID','Cliente','Arquivo STL','Data','Valor Estimado','Status','Ações'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#6B7280' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orcamentos.map((s, i) => (
                      <tr key={s.id} style={{ background: i % 2 === 0 ? '#111827' : '#161B24', borderBottom: '1px solid #1F2937' }}>
                        <td className="px-4 py-3 font-mono text-[12px] font-bold" style={{ color: '#F97316' }}>{s.id}</td>
                        <td className="px-4 py-3 font-medium" style={{ color: '#F9FAFB' }}>{s.cliente}</td>
                        <td className="px-4 py-3 font-mono text-[12px] text-gray-300">
                          📁 {s.arquivo}
                        </td>
                        <td className="px-4 py-3 font-mono text-[12px]" style={{ color: '#9CA3AF' }}>{s.data}</td>
                        <td className="px-4 py-3 font-semibold text-sm" style={{ color: s.precoEstimado ? '#22C55E' : '#9CA3AF' }}>
                          {s.precoEstimado ? `R$ ${s.precoEstimado.toFixed(2)}` : 'A definir'}
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setAnsweringQuote(s)}
                              className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all hover:bg-orange-500/20 cursor-pointer" 
                              style={{ background: '#1F2937', border: '1px solid rgba(249,115,22,0.3)', color: '#F97316' }}
                            >
                              💬 Responder
                            </button>
                            <button
                              onClick={() => handleDeleteQuote(s)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all hover:bg-red-900/50 cursor-pointer"
                              style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#EF4444' }}
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ESTOQUE ── */}
          {section === 'estoque' && (
            <div className="flex flex-col gap-3">
              {filamentos.map(f => {
                const currentStock = f.stockGrams || 0;
                const minStock = f.minStockGrams || 300;
                const pct = Math.min(100, (currentStock / (minStock * 4)) * 100);
                const low = currentStock < minStock;
                return (
                  <div key={f.id || f.color} className="p-4 rounded-xl flex flex-col gap-2 shadow-lg" style={{ background: '#1F2937', border: `1px solid ${low ? 'rgba(239,68,68,0.4)' : '#374151'}` }}>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm" style={{ color: '#F9FAFB' }}>
                        {f.color} <span className="text-[11px] font-normal" style={{ color: '#9CA3AF' }}>({f.material})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {low && <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>⚠ Estoque baixo</span>}
                        <span className="font-bold font-mono text-[14px]" style={{ color: low ? '#EF4444' : '#F9FAFB' }}>{f.stockGrams} g</span>
                        
                        <div className="flex items-center gap-1 ml-2">
                          <button 
                            onClick={() => handleFilamentStockChange(f, -100)}
                            className="w-7 h-7 rounded bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-300 flex items-center justify-center transition-colors cursor-pointer"
                            title="Remover 100g"
                          >
                            -100
                          </button>
                          <button 
                            onClick={() => handleFilamentStockChange(f, 250)}
                            className="px-2 h-7 rounded bg-orange-500/20 hover:bg-orange-500/30 text-xs font-bold text-orange-400 flex items-center justify-center transition-colors cursor-pointer"
                            title="Adicionar carretel 250g"
                          >
                            +250g
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="h-2.5 rounded-full" style={{ background: '#111827' }}>
                      <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: low ? '#EF4444' : '#F97316' }} />
                    </div>
                    <div className="text-[11px] text-gray-400 flex items-center justify-between">
                      <span>Mínimo recomendado: {minStock} g</span>
                      <span className="text-[10px] font-mono">{pct.toFixed(0)}% da meta</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── AJUSTE DE PREÇOS ── */}
          {section === 'precos' && (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-gray-100">💰 Tabela de Precificação Base</h3>
                  <p className="text-xs text-gray-400">Altere o preço base de qualquer figure e clique em Salvar para atualizar imediatamente na vitrine.</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {catalog.map(p => (
                  <PriceRow key={p.id} product={p} onSave={newPrice => handleSavePrice(p, newPrice)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modais com fechamento automático e salvamento persistente */}
      {showNewModal && (
        <ProductModal 
          onClose={() => setShowNewModal(false)} 
          onSave={newP => {
            setCatalog(prev => [newP, ...prev.filter(x => x.id !== newP.id)]);
          }} 
        />
      )}
      {editingProduct && (
        <ProductModal 
          initialData={editingProduct} 
          onClose={() => setEditingProduct(null)} 
          onSave={updatedP => {
            setCatalog(prev => prev.map(x => x.id === updatedP.id ? updatedP : x));
          }} 
        />
      )}
      {showNewFilamentModal && (
        <FilamentModal 
          onClose={() => setShowNewFilamentModal(false)} 
          onSave={newF => {
            setFilamentos(prev => [newF, ...prev]);
          }} 
        />
      )}
      {answeringQuote && (
        <QuoteModal
          quote={answeringQuote}
          onClose={() => setAnsweringQuote(null)}
          onSave={updatedQ => {
            setOrcamentos(prev => prev.map(x => x.id === updatedQ.id ? updatedQ : x));
          }}
        />
      )}
    </div>
  );
}

// Linha de Preço com input e botão de salvar dedicado
function PriceRow({ product, onSave }: { product: Product; onSave: (val: number) => void }) {
  const [val, setVal] = useState(product.basePrice.toString());
  const [isSaved, setIsSaved] = useState(false);

  function handleSave() {
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      onSave(num);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl shadow-sm transition-all" style={{ background: '#1F2937', border: '1px solid #374151' }}>
      <img src={product.image} alt={product.name} className="w-11 h-13 object-cover rounded-lg shrink-0 border border-gray-700 bg-black/40" />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm" style={{ color: '#F9FAFB' }}>{product.name}</div>
        <div className="text-[11px]" style={{ color: '#9CA3AF' }}>{product.category} • {product.scales?.[0] || '1:10'}</div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[12px] font-bold" style={{ color: '#9CA3AF' }}>R$</span>
        <input
          type="number"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
          className="w-24 h-9 px-3 rounded-lg text-sm font-bold outline-none text-right transition-colors"
          style={{ background: '#111827', border: '1px solid #374151', color: '#F97316' }}
          onFocus={e => (e.target.style.borderColor = '#F97316')}
          onBlur={e => (e.target.style.borderColor = '#374151')}
        />
        <button
          onClick={handleSave}
          className="h-9 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          style={{
            background: isSaved ? '#22C55E' : '#F97316',
            color: '#fff'
          }}
        >
          {isSaved ? '✅ Salvo' : '💾 Salvar'}
        </button>
      </div>
    </div>
  );
}
