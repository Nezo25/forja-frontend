export type ProductCategory = 'FIGURE_POKEMON' | 'DIORAMA' | 'CHIBI' | 'ACCESSORY_3D';

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  FIGURE_POKEMON: 'Figures Pokémon',
  DIORAMA: 'Dioramas e Cenários',
  CHIBI: 'Chibis / Miniaturas',
  ACCESSORY_3D: 'Acessórios Geek 3D'
};

export const ENUM_BY_LABEL: Record<string, ProductCategory> = {
  'Figures Pokémon': 'FIGURE_POKEMON',
  'Figures': 'FIGURE_POKEMON',
  'Dioramas e Cenários': 'DIORAMA',
  'Chibis / Miniaturas': 'CHIBI',
  'Acessórios Geek 3D': 'ACCESSORY_3D',
  'Acessórios & Colecionáveis': 'ACCESSORY_3D',
  'Acessórios TCG (3D)': 'ACCESSORY_3D'
};

export function toProductCategory(val?: string | null): ProductCategory {
  if (!val) return 'FIGURE_POKEMON';
  if (val in CATEGORY_LABELS) return val as ProductCategory;
  if (val in ENUM_BY_LABEL) return ENUM_BY_LABEL[val];
  return 'FIGURE_POKEMON';
}
