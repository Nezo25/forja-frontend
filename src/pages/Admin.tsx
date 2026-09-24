import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { products as initialProducts, type Product, type Category, type PokemonType } from '@/data/products';
import { TypeBadge } from '@/components/TypeBadge';

type Section = 'catalogo' | 'pedidos' | 'orcamentos' | 'estoque' | 'precos';

const NAV: { id: Section; icon: string; label: string }[] = [
  { id: 'catalogo', icon: '📦', label: 'Catálogo' },
  { id: 'pedidos', icon: '🛒', label: 'Pedidos' },
  { id: 'orcamentos', icon: '📐', label: 'Orçamentos STL' },
  { id: 'estoque', icon: '🧵', label: 'Estoque Filamento' },
  { id: 'precos', icon: '💰', label: 'Ajuste de Preços' },
];

const MOCK_STL = [
  { id: '#S012', cliente: 'Treinador Oculto', arquivo: 'snorlax_custom.stl', status: 'Aguardand✕ análise', data: '23/09/2025' },
  { id: '#S011', cliente: 'Red', arquivo: 'pikachu_gigante.stl', status: 'Orçament✕ enviado', data: '22/09/2025' },
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
  'Aguardand✕ pgto':   { bg: 'rgba(249,115,22,0.15)', text: '#F97316' },
  'Entregue':          { bg: 'rgba(34,197,94,0.15)', text: '#22C55E' },
  'Enviado':           { bg: 'rgba(96,165,250,0.15)', text: '#60A5FA' },
  'Aguardand✕ análise':{ bg: 'rgba(249,115,22,0.15)', text: '#F97316' },
  'Orçament✕ enviado': { bg: 'rgba(96,165,250,0.15)', text: '#60A5FA' },
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
      className="w-full h-9 px-3 rounded-lg text-sm outline-none"
      style={{ background: '#111827', border: '1px solid #374151', color: '#F9FAFB' }}
      onFocus={e => (e.target.style.borderColor = '#F97316')}
      onBlur={e => (e.target.style.borderColor = '#374151')}
    />
  );
}

function ProductModal({ onClose, onSave, initialData }: { onClose: () => void; onSave: (p: Partial<Product>) => void; initialData?: Product }) {
    const [form, setForm] = useState({
    name: initialData?.name || '', 
    category: initialData?.category || 'Figures Pok�mon', 
    types: initialData?.types.join(', ') || '',
    scale: initialData?.scales[0] || '1:10', 
    material: initialData?.materials[0] || 'PLA', 
    printTimeH: initialData?.printTimeH?.toString() || '', 
    filamentG: initialData?.filamentG?.toString() || '', 
    basePrice: initialData?.basePrice?.toString() || '', 
    image: initialData?.image || '', 
    active: initialData ? initialData.active : true,
  });

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      id: initialData?.id || `p${Date.now()}`,
      name: form.name,
      category: form.category as any,
      types: form.types.split(',').map(t => t.trim()).filter(Boolean) as PokemonType[],
      scales: [form.scale as any],
      materials: [form.material as any],
      basePrice: parseFloat(form.basePrice) || 0,
      finishOptions: [{ label: 'Peça Crua', extra: 0 }, { label: 'Com Primer', extra: 25 }, { label: 'Pintado à Mão', extra: 85 }],
      image: form.image || 'https://images.unsplash.com/photo-1613771404784-63a9eeed2e30?w=600&h=700&fit=crop&auto=format',
      printTimeH: parseInt(form.printTimeH) || 0,
      filamentG: parseInt(form.filamentG) || 0,
      active: form.active,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-aut✕ rounded-2xl" style={{ background: '#111827', border: '1px solid #374151' }} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSave}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #374151' }}>
            <h2 className="font-extrabold text-lg" style={{ color: '#F9FAFB' }}>{initialData ? 'Editar Produto' : 'Nova Figure / Produto'}</h2>
            <button type="button" onClick={onClose} className="text-sm px-3 py-1 rounded-lg" style={{ color: '#9CA3AF', background: '#1F2937' }}>✕</button>
          </div>
          <div className="p-5 flex flex-col gap-4">
            <Field label="Nome d✕ produt✕ *"><Input required placeholder="Charizard Stance" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></Field>
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
              <Field label="Preç✕ base (R$) *"><Input required type="number" placeholder="149" value={form.basePrice} onChange={e => setForm(f => ({ ...f, basePrice: e.target.value }))} /></Field>
              <Field label="Temp✕ impressã✕ (h)"><Input type="number" placeholder="18" value={form.printTimeH} onChange={e => setForm(f => ({ ...f, printTimeH: e.target.value }))} /></Field>
              <Field label="Filament✕ (g)"><Input type="number" placeholder="320" value={form.filamentG} onChange={e => setForm(f => ({ ...f, filamentG: e.target.value }))} /></Field>
            </div>
            <Field label="Imagem d✕ produto">
              <input 
                type="file" 
                accept="image/*" 
                onChange={e => {
                  if (e.target.files?.[0]) {
                    setForm(f => ({ ...f, image: URL.createObjectURL(e.target.files![0]) }))
                  }
                }} 
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1F2937] file:text-[#F9FAFB] hover:file:bg-[#374151]"
              />
            </Field>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 rounded" />
              <span className="text-sm font-semibold" style={{ color: '#D1D5DB' }}>Produt✕ ativo</span>
            </label>
            <button type="submit" className="w-full h-11 rounded-xl font-extrabold text-sm mt-1" style={{ background: '#F97316', color: '#fff' }}>{initialData ? "Atualizar Produto" : "Salvar Produto"} ???</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Admin() {
  const [section, setSection] = useState<Section>('catalogo');
  const [catalog, setCatalog] = useState(initialProducts);
  const [orders, setOrders] = useState<any[]>([]);
  const [orcamentos, setOrcamentos] = useState(MOCK_STL);
  const [filamentos, setFilamentos] = useState<any[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function toggleActive(id: string) {
    setCatalog(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  }

  function addProduct(p: Partial<Product>) {
    setCatalog(prev => [p as Product, ...prev]);
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#0B0F19' }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 md:hidden" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen z-50 md:z-aut✕ flex-shrink-0 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{ width: 220, background: '#111827', borderRight: '1px solid #1F2937' }}
      >
        <div className="flex items-center gap-2.5 px-4 py-5" style={{ borderBottom: '1px solid #1F2937' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: 'linear-gradient(135deg,#F97316,#EA580C)' }}>🔩</div>
          <div>
            <div className="font-extrabold text-[13px]" style={{ color: '#F9FAFB' }}>Forja Admin</div>
            <div className="text-[10px]" style={{ color: '#6B7280' }}>Painel de Controle</div>
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => { setSection(n.id); setSidebarOpen(false); }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-left transition-all w-full"
              style={section === n.id
                ? { background: 'rgba(249,115,22,0.12)', color: '#F97316', border: '1px solid rgba(249,115,22,0.2)' }
                : { color: '#9CA3AF', background: 'transparent', border: '1px solid transparent' }
              }
            >
              <span>{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>

        <div className="p-3" style={{ borderTop: '1px solid #1F2937' }}>
          <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all" style={{ color: '#9CA3AF' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#F97316')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
          >
            ← Ver Loja
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 md:px-8 py-4" style={{ borderBottom: '1px solid #1F2937', background: '#111827' }}>
          <button onClick={() => setSidebarOpen(true)} className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: '#1F2937', color: '#9CA3AF' }}>☰</button>
          <h1 className="font-extrabold text-lg" style={{ color: '#F9FAFB' }}>
            {NAV.find(n => n.id === section)?.icon} {NAV.find(n => n.id === section)?.label}
          </h1>
          {section === 'catalogo' && (
            <button onClick={() => setShowNewModal(true)} className="ml-aut✕ h-9 px-4 rounded-lg text-sm font-bold flex items-center gap-2 transition-all" style={{ background: '#F97316', color: '#fff' }}>
              + Nova Figure
            </button>
          )}
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
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #374151' }}>
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
                              <img src={p.image} alt={p.name} className="w-10 h-12 object-cover rounded-lg shrink-0" style={{ background: '#0B0F19' }} />
                              <div>
                                <div className="font-semibold" style={{ color: '#F9FAFB' }}>{p.name}</div>
                                <div className="text-[10px] font-mono" style={{ color: '#6B7280' }}>{p.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[12px]" style={{ color: '#D1D5DB' }}>{p.category}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {p.types.map(t => <TypeBadge key={t} type={t} />)}
                              {p.types.length === 0 && <span className="text-[11px]" style={{ color: '#6B7280' }}>—</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {p.scales.map(s => (
                                <span key={s} className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: '#1F2937', color: '#9CA3AF', border: '1px solid #374151' }}>{s}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mon✕ text-[12px]" style={{ color: '#9CA3AF' }}>{p.printTimeH}h</td>
                          <td className="px-4 py-3 font-mon✕ text-[12px]" style={{ color: '#9CA3AF' }}>{p.filamentG}g</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold" style={p.active ? { background: 'rgba(34,197,94,0.15)', color: '#22C55E' } : { background: '#1F2937', color: '#6B7280' }}>
                              {p.active ? 'Ativo' : 'Pausado'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all hover:bg-[#374151]"
                                style={{ background: '#1F2937', border: '1px solid #374151', color: '#60A5FA' }}
                              >
                                ✏️ Editar
                              </button>
                              <button
                                onClick={() => toggleActive(p.id)}
                                className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all"
                                style={{ background: '#1F2937', border: '1px solid #374151', color: '#9CA3AF' }}
                              >
                                {p.active ? '⏸ Pausar' : '▶ Ativar'}
                              </button>
                              <button
                                onClick={() => setCatalog(prev => prev.filter(x => x.id !== p.id))}
                                className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all hover:bg-red-900/50"
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
                  { label: 'Total mês', value: 'R$ 9.200', icon: '💰' },
                  { label: 'Em impressão', value: '3', icon: '🖨️' },
                  { label: 'Enviados', value: '12', icon: '📬' },
                  { label: 'Ticket médio', value: 'R$ 218', icon: '📊' },
                ].map(k => (
                  <div key={k.label} className="p-4 rounded-xl" style={{ background: '#1F2937', border: '1px solid #374151' }}>
                    <div className="text-xl mb-1">{k.icon}</div>
                    <div className="text-2xl font-extrabold" style={{ color: '#F97316' }}>{k.value}</div>
                    <div className="text-[11px]" style={{ color: '#9CA3AF' }}>{k.label}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="p-5 rounded-xl" style={{ background: '#1F2937', border: '1px solid #374151' }}>
                <div className="text-sm font-bold mb-4" style={{ color: '#F9FAFB' }}>Vendas mensais (R$)</div>
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

              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #374151' }}>
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
                        <td className="px-4 py-3 font-mon✕ text-[12px]" style={{ color: '#F97316' }}>{o.id}</td>
                        <td className="px-4 py-3 font-medium" style={{ color: '#F9FAFB' }}>{o.cliente}</td>
                        <td className="px-4 py-3" style={{ color: '#D1D5DB' }}>{o.produto}</td>
                        <td className="px-4 py-3 font-mon✕ text-[12px]" style={{ color: '#9CA3AF' }}>{o.data}</td>
                        <td className="px-4 py-3 font-bold" style={{ color: '#F9FAFB' }}>R$ {o.valor}</td>
                        <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                        <td className="px-4 py-3">
                            <button
                                onClick={() => setOrders(prev => prev.filter(x => x.id !== o.id))}
                                className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all hover:bg-red-900/50"
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
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #374151' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: '#1F2937', borderBottom: '1px solid #374151' }}>
                      {['ID','Cliente','Arquiv✕ STL','Data','Status','Ação'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#6B7280' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orcamentos.map((s, i) => (
                      <tr key={s.id} style={{ background: i % 2 === 0 ? '#111827' : '#161B24', borderBottom: '1px solid #1F2937' }}>
                        <td className="px-4 py-3 font-mon✕ text-[12px]" style={{ color: '#F97316' }}>{s.id}</td>
                        <td className="px-4 py-3 font-medium" style={{ color: '#F9FAFB' }}>{s.cliente}</td>
                        <td className="px-4 py-3 font-mon✕ text-[12px]" style={{ color: '#9CA3AF' }}>{s.arquivo}</td>
                        <td className="px-4 py-3 font-mon✕ text-[12px]" style={{ color: '#9CA3AF' }}>{s.data}</td>
                        <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all hover:bg-[#374151]" style={{ background: '#1F2937', border: '1px solid #374151', color: '#9CA3AF' }}>Responder</button>
                            <button
                                onClick={() => setOrcamentos(prev => prev.filter(x => x.id !== s.id))}
                                className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all hover:bg-red-900/50"
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
                const pct = Math.min(100, (f.stockG / (f.minStockG * 5)) * 100);
                const low = f.stockG < f.minStockG;
                return (
                  <div key={f.color + f.material} className="p-4 rounded-xl flex flex-col gap-2" style={{ background: '#1F2937', border: `1px solid ${low ? 'rgba(239,68,68,0.4)' : '#374151'}` }}>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm" style={{ color: '#F9FAFB' }}>{f.color} <span className="text-[11px] font-normal" style={{ color: '#9CA3AF' }}>({f.material})</span></div>
                      <div className="flex items-center gap-2">
                        {low && <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>⚠ Estoque baixo</span>}
                        <span className="font-bold font-mon✕ text-[13px]" style={{ color: low ? '#EF4444' : '#F9FAFB' }}>{f.stockG} kg</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: '#111827' }}>
                      <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: low ? '#EF4444' : '#F97316' }} />
                    </div>
                    <div className="text-[10px]" style={{ color: '#6B7280' }}>Mínim✕ recomendado: {f.minStockG} kg</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── PREÇOS ── */}
          {section === 'precos' && (
            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: '#9CA3AF' }}>Ajuste ✕ preç✕ base de cada figura. Alterações refletem imediatamente n✕ catálogo.</p>
              <div className="flex flex-col gap-2">
                {catalog.filter(p => p.active).map(p => (
                  <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#1F2937', border: '1px solid #374151' }}>
                    <img src={p.image} alt={p.name} className="w-10 h-12 object-cover rounded-lg shrink-0" style={{ background: '#0B0F19' }} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm" style={{ color: '#F9FAFB' }}>{p.name}</div>
                      <div className="text-[11px]" style={{ color: '#9CA3AF' }}>{p.category}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px]" style={{ color: '#9CA3AF' }}>R$</span>
                      <input
                        type="number"
                        defaultValue={p.basePrice}
                        className="w-24 h-9 px-3 rounded-lg text-sm font-bold outline-none text-right"
                        style={{ background: '#111827', border: '1px solid #374151', color: '#F97316' }}
                        onFocus={e => (e.target.style.borderColor = '#F97316')}
                        onBlur={e => (e.target.style.borderColor = '#374151')}
                        onChange={e => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) setCatalog(prev => prev.map(pr => pr.id === p.id ? { ...pr, basePrice: val } : pr));
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {showNewModal && <ProductModal onClose={() => setShowNewModal(false)} onSave={addProduct} />}
      {editingProduct && <ProductModal initialData={editingProduct} onClose={() => setEditingProduct(null)} onSave={(p) => { setCatalog(prev => prev.map(x => x.id === p.id ? p as Product : x)); setEditingProduct(null); }} />}
    </div>
  );
}






