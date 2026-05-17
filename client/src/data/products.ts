/**
 * Catálogo de produtos da Vince Kids.
 *
 * Este arquivo é a fonte da verdade EM BUILD TIME (o que vai pro deploy).
 * Em RUNTIME o admin (/admin) pode editar os produtos e a alteração fica
 * salva em localStorage do navegador dele. Pra publicar pra todo mundo,
 * o admin exporta o JSON e cola aqui no array `DEFAULT_PRODUCTS`.
 *
 * Como usar nos componentes: use o hook `useProducts()` (NÃO importe
 * DEFAULT_PRODUCTS direto), pois o hook reflete edições do admin em runtime.
 */

export const categories = [
  { slug: "camisas", label: "Camisas" },
  { slug: "bermudas", label: "Bermudas" },
  { slug: "conjuntos", label: "Conjuntos" },
  { slug: "jardineiras", label: "Jardineiras" },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export interface ProductSize {
  size: string;   // "1", "2", "3", "4", "6", "8", "10", "P", "M"...
  stock: number;  // 0 = esgotado
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  installments?: string;
  image: string;            // imagem principal
  gallery?: string[];       // imagens extras (opcional)
  category: CategorySlug;
  sizes: ProductSize[];
  details?: string[];       // bullets de info (material, lavagem, etc)
  isNew?: boolean;
}

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "camisa-linho-salvia",
    name: "Camisa Linho Sálvia",
    description:
      "Camisa de linho 100% natural na cor sálvia, com modelagem confortável e respirável. Perfeita pra dias de calor com elegância.",
    price: 129.9,
    installments: "3x de R$ 43,30",
    image: "/images/product-shirt-sage.jpg",
    category: "camisas",
    isNew: true,
    sizes: [
      { size: "2", stock: 4 },
      { size: "4", stock: 3 },
      { size: "6", stock: 5 },
      { size: "8", stock: 2 },
      { size: "10", stock: 0 },
    ],
    details: [
      "Composição: 100% linho",
      "Cor: Sálvia",
      "Lavagem à máquina (água fria)",
      "Não usar alvejante",
    ],
  },
  {
    id: "bermuda-chino-areia",
    name: "Bermuda Chino Areia",
    description:
      "Bermuda chino em algodão premium com elastano no cós. Versátil pra combinar com qualquer camisa do guarda-roupa.",
    price: 89.9,
    installments: "2x de R$ 44,95",
    image: "/images/product-shorts-beige.jpg",
    category: "bermudas",
    sizes: [
      { size: "1", stock: 2 },
      { size: "2", stock: 6 },
      { size: "3", stock: 4 },
      { size: "4", stock: 4 },
      { size: "6", stock: 3 },
    ],
    details: [
      "Composição: 97% algodão, 3% elastano",
      "Cor: Areia",
      "Cós com elástico interno",
    ],
  },
  {
    id: "conjunto-marinheiro",
    name: "Conjunto Marinheiro",
    description:
      "Conjunto de duas peças (camisa + bermuda) inspirado no estilo náutico clássico. Listras marinho com detalhes em branco.",
    price: 159.9,
    installments: "4x de R$ 39,97",
    image: "/images/product-set-blue.jpg",
    category: "conjuntos",
    isNew: true,
    sizes: [
      { size: "2", stock: 3 },
      { size: "3", stock: 2 },
      { size: "4", stock: 5 },
      { size: "6", stock: 1 },
    ],
    details: [
      "Inclui camisa + bermuda",
      "Composição: 100% algodão",
      "Cor: Azul marinho com listras brancas",
    ],
  },
  {
    id: "jardineira-jeans",
    name: "Jardineira Jeans",
    description:
      "Jardineira jeans clássica com bolso frontal e alças ajustáveis. Tecido macio e durável pra todos os dias.",
    price: 189.9,
    installments: "5x de R$ 37,98",
    image: "/images/product-overalls.jpg",
    category: "jardineiras",
    sizes: [
      { size: "1", stock: 1 },
      { size: "2", stock: 3 },
      { size: "3", stock: 4 },
      { size: "4", stock: 2 },
    ],
    details: [
      "Composição: 98% algodão, 2% elastano",
      "Alças ajustáveis com botão",
      "Bolso frontal canguru",
    ],
  },
];
