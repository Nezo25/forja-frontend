export type PokemonType =
  | 'Normal' | 'Fogo' | 'Água' | 'Elétrico' | 'Planta' | 'Gelo'
  | 'Lutador' | 'Veneno' | 'Terra' | 'Voador' | 'Psíquico' | 'Inseto'
  | 'Pedra' | 'Fantasma' | 'Dragão' | 'Escuridão' | 'Metálico' | 'Fada';

export type Category = 'Figures Pokémon' | 'Figures' | 'Dioramas e Cenários' | 'Chibis / Miniaturas' | 'Acessórios & Colecionáveis' | 'TCG';
export type Scale = '1:10' | '1:1' | 'Chibi' | 'Diorama';
export type Finish = 'Peça Crua' | 'Com Primer' | 'Pintado à Mão';
export type Material = 'PLA' | 'Resina';

export interface FinishOption {
  label: Finish;
  extra: number;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  types: PokemonType[];
  scales: Scale[];
  materials: Material[];
  basePrice: number;
  finishOptions: FinishOption[];
  image: string;
  printTimeH: number;
  filamentG: number;
  active: boolean;
  featured?: boolean;
}

export const FINISH_OPTIONS: FinishOption[] = [
  { label: 'Peça Crua',       extra: 0 },
  { label: 'Com Primer',      extra: 25 },
  { label: 'Pintado à Mão',   extra: 85 },
];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Charizard Stance',
    category: 'Figures Pokémon',
    types: ['Fogo', 'Dragão'],
    scales: ['1:10', '1:1'],
    materials: ['PLA', 'Resina'],
    basePrice: 149,
    finishOptions: FINISH_OPTIONS,
    image: 'https://placehold.co/600x700/1F2937/F97316?text=Figure',
    printTimeH: 18,
    filamentG: 320,
    active: true,
    featured: true,
  },
  {
    id: 'p2',
    name: 'Gengar Sorridente',
    category: 'Figures Pokémon',
    types: ['Fantasma'],
    scales: ['1:10', 'Chibi'],
    materials: ['PLA', 'Resina'],
    basePrice: 89,
    finishOptions: FINISH_OPTIONS,
    image: 'https://placehold.co/600x700/1F2937/F97316?text=Figure',
    printTimeH: 10,
    filamentG: 180,
    active: true,
    featured: true,
  },
  {
    id: 'p3',
    name: 'Gyarados Emergindo',
    category: 'Dioramas',
    types: ['Água', 'Dragão'],
    scales: ['Diorama'],
    materials: ['Resina'],
    basePrice: 349,
    finishOptions: FINISH_OPTIONS,
    image: 'https://placehold.co/600x700/1F2937/F97316?text=Figure',
    printTimeH: 42,
    filamentG: 780,
    active: true,
    featured: true,
  },
  {
    id: 'p4',
    name: 'Pikachu Thunder',
    category: 'Figures Pokémon',
    types: ['Elétrico'],
    scales: ['1:10', 'Chibi'],
    materials: ['PLA'],
    basePrice: 79,
    finishOptions: FINISH_OPTIONS,
    image: 'https://placehold.co/600x700/1F2937/F97316?text=Figure',
    printTimeH: 8,
    filamentG: 140,
    active: true,
  },
  {
    id: 'p5',
    name: 'Mewtwo Armadura',
    category: 'Figures Pokémon',
    types: ['Psíquico'],
    scales: ['1:10', '1:1'],
    materials: ['Resina'],
    basePrice: 229,
    finishOptions: FINISH_OPTIONS,
    image: 'https://placehold.co/600x700/1F2937/F97316?text=Figure',
    printTimeH: 28,
    filamentG: 520,
    active: true,
  },
  {
    id: 'p6',
    name: 'Bulbasaur Chibi',
    category: 'Chibis',
    types: ['Planta'],
    scales: ['Chibi'],
    materials: ['PLA'],
    basePrice: 55,
    finishOptions: FINISH_OPTIONS,
    image: 'https://placehold.co/600x700/1F2937/F97316?text=Figure',
    printTimeH: 6,
    filamentG: 95,
    active: true,
  },
  {
    id: 'p7',
    name: 'Garchomp Diorama',
    category: 'Dioramas',
    types: ['Dragão'],
    scales: ['Diorama'],
    materials: ['Resina'],
    basePrice: 419,
    finishOptions: FINISH_OPTIONS,
    image: 'https://placehold.co/600x700/1F2937/F97316?text=Figure',
    printTimeH: 56,
    filamentG: 960,
    active: true,
  },
  {
    id: 'p8',
    name: 'Suporte Pokébola',
    category: 'Acessórios',
    types: [],
    scales: ['1:1'],
    materials: ['PLA'],
    basePrice: 38,
    finishOptions: FINISH_OPTIONS,
    image: 'https://placehold.co/600x700/1F2937/F97316?text=Figure',
    printTimeH: 3,
    filamentG: 60,
    active: true,
  },
  {
    id: 'p9',
    name: 'Dialga Lendário',
    category: 'Figures Pokémon',
    types: ['Metálico', 'Dragão'],
    scales: ['1:10'],
    materials: ['Resina'],
    basePrice: 289,
    finishOptions: FINISH_OPTIONS,
    image: 'https://placehold.co/600x700/1F2937/F97316?text=Figure',
    printTimeH: 34,
    filamentG: 610,
    active: false,
  },
];

export const TYPE_COLORS: Record<PokemonType, { text: string; bg: string; border?: string }> = {
  Normal:    { text: '#A8A29E', bg: 'rgba(168,162,158,0.15)' },
  Fogo:      { text: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
  Água:      { text: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
  Elétrico:  { text: '#EAB308', bg: 'rgba(234,179,8,0.15)' },
  Planta:    { text: '#22C55E', bg: 'rgba(34,197,94,0.15)' },
  Gelo:      { text: '#06B6D4', bg: 'rgba(6,182,212,0.15)' },
  Lutador:   { text: '#DC2626', bg: 'rgba(220,38,38,0.15)' },
  Veneno:    { text: '#A855F7', bg: 'rgba(168,85,247,0.15)' },
  Terra:     { text: '#D97706', bg: 'rgba(217,119,6,0.15)' },
  Voador:    { text: '#8B5CF6', bg: 'rgba(139,92,246,0.15)' },
  Psíquico:  { text: '#EC4899', bg: 'rgba(236,72,153,0.15)' },
  Inseto:    { text: '#84CC16', bg: 'rgba(132,204,22,0.15)' },
  Pedra:     { text: '#B45309', bg: 'rgba(180,83,9,0.15)' },
  Fantasma:  { text: '#6366F1', bg: 'rgba(99,102,241,0.15)' },
  Dragão:    { text: '#4F46E5', bg: 'rgba(79,70,229,0.15)' },
  Escuridão: { text: '#C7D2FE', bg: '#312E81', border: '#4338CA' },
  Metálico:  { text: '#94A3B8', bg: 'rgba(148,163,184,0.15)' },
  Fada:      { text: '#F472B6', bg: 'rgba(244,114,182,0.15)' },
};

export const ALL_TYPES: PokemonType[] = [
  'Normal', 'Fogo', 'Água', 'Elétrico', 'Planta', 'Gelo',
  'Lutador', 'Veneno', 'Terra', 'Voador', 'Psíquico', 'Inseto',
  'Pedra', 'Fantasma', 'Dragão', 'Escuridão', 'Metálico', 'Fada'
];

export const ALL_CATEGORIES: Category[] = ['Figures Pokémon', 'Figures', 'Dioramas e Cenários', 'Chibis / Miniaturas', 'Acessórios & Colecionáveis', 'TCG'];
export const ALL_SCALES: Scale[] = ['1:10','1:1','Chibi','Diorama'];
export const ALL_FINISHES: Finish[] = ['Peça Crua','Com Primer','Pintado à Mão'];

export interface CartItem {
  product: Product;
  scale: Scale | string;
  finish: Finish | string;
  material: Material;
  qty: number;
  unitPrice: number;
  observations?: string;
  customized?: boolean;
}
