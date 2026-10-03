import React, { useState, useEffect } from 'react';
import { Product } from '../data/products';

interface NewTcgProductModalProps {
  onClose: () => void;
  onSave: (p: Product) => void;
  initialData?: Product;
}

export function NewTcgProductModal({ onClose, onSave, initialData }: NewTcgProductModalProps) {
  const [form, setForm] = useState<Partial<Product>>({
    name: '',
    category: 'TCG',
    tcgType: 'Booster Avulso',
    expansion: '',
    language: 'Português (PT-BR)',
    basePrice: 0,
    stock: 0,
    image: '',
    active: true,
    types: [],
    scales: [],
    materials: [],
    finishOptions: [],
    printTimeH: 0,
    filamentG: 0,
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || form.basePrice === undefined || form.basePrice <= 0) {
      alert("Preencha o nome e um preço válido!");
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      await saveProduct({
        ...(form as Product),
        id: form.id
      });
      setLoading(false);
    }, 400); // feedback
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-gray-900/95 backdrop-blur-md border-b border-gray-700 rounded-t-xl">
          <div>
            <h2 className="font-extrabold text-lg text-gray-100">{initialData ? 'Editar Produto TCG' : 'Novo Produto TCG / Colecionável'}</h2>
            <p className="text-xs text-gray-400">Cadastre boosters, caixas seladas e acessórios oficiais</p>
          </div>
          <button type="button" onClick={onClose} className="text-sm px-3 py-1 rounded-lg text-gray-400 hover:text-white bg-gray-800">
            X
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto">
          <form id="tcg-form" onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nome do Produto *</label>
              <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="w-full h-9 px-3 rounded-lg text-sm outline-none bg-gray-800 border border-gray-700 text-gray-100 focus:border-orange-500" placeholder="Ex: Booster Pack - Fagulhas Impetuosas" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tipo de Item TCG</label>
                <select value={form.tcgType || ''} onChange={e => setForm(f => ({...f, tcgType: e.target.value}))} className="w-full h-9 px-3 rounded-lg text-sm outline-none bg-gray-800 border border-gray-700 text-gray-100 focus:border-orange-500">
                  <option>Booster Avulso</option>
                  <option>Booster Box 36 un</option>
                  <option>Elite Trainer Box - ETB</option>
                  <option>Blister Quádruplo/Triplo</option>
                  <option>Deck Pronto</option>
                  <option>Sleeves/Acessórios Oficiais</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Idioma</label>
                <select value={form.language || ''} onChange={e => setForm(f => ({...f, language: e.target.value}))} className="w-full h-9 px-3 rounded-lg text-sm outline-none bg-gray-800 border border-gray-700 text-gray-100 focus:border-orange-500">
                  <option>Português (PT-BR)</option>
                  <option>Inglês (EN)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Expansão / Coleção</label>
              <input value={form.expansion || ''} onChange={e => setForm(f => ({...f, expansion: e.target.value}))} className="w-full h-9 px-3 rounded-lg text-sm outline-none bg-gray-800 border border-gray-700 text-gray-100 focus:border-orange-500" placeholder="Ex: Escarlate e Violeta 8" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Preço de Venda (R$) *</label>
                <input required type="number" step="0.01" min="0" value={form.basePrice || ''} onChange={e => setForm(f => ({...f, basePrice: parseFloat(e.target.value)}))} className="w-full h-9 px-3 rounded-lg text-sm outline-none bg-gray-800 border border-gray-700 text-gray-100 focus:border-orange-500" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Quantidade em Estoque</label>
                <input type="number" min="0" value={form.stock || 0} onChange={e => setForm(f => ({...f, stock: parseInt(e.target.value, 10)}))} className="w-full h-9 px-3 rounded-lg text-sm outline-none bg-gray-800 border border-gray-700 text-gray-100 focus:border-orange-500" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">URL da Imagem</label>
              <input value={form.image} onChange={e => setForm(f => ({...f, image: e.target.value}))} className="w-full h-9 px-3 rounded-lg text-sm outline-none bg-gray-800 border border-gray-700 text-gray-100 focus:border-orange-500" placeholder="https://exemplo.com/imagem.jpg" />
            </div>

            <label className="flex items-center gap-2 cursor-pointer mt-2 text-sm text-gray-200">
              <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({...f, active: e.target.checked}))} className="w-4 h-4 accent-orange-500" />
              Produto ativo na vitrine da loja
            </label>
          </form>
        </div>
        
        <div className="p-5 border-t border-gray-700 bg-gray-900/95 rounded-b-xl">
          <button type="submit" form="tcg-form" disabled={loading} className="w-full py-2.5 rounded-lg text-sm font-extrabold text-white bg-orange-600 hover:bg-orange-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? 'Salvando...' : 'Salvar Produto TCG 🃏'}
          </button>
        </div>
      </div>
    </div>
  );
}
