# Vince Kids

Loja simples (SPA) pra catálogo e carrinho de produtos infantis.
**Stack:** Vite + React 19 + TypeScript + TailwindCSS 4 + shadcn/ui + wouter.
Zero backend: produtos vivem em código, carrinho em localStorage, checkout no Instagram.

## Rodar local

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm check      # tsc --noEmit
pnpm build      # gera /dist pra deploy
```

## Páginas

| Rota              | O que faz                                                          |
| ----------------- | ------------------------------------------------------------------ |
| `/`               | Home (hero, carrossel, social proof, FAQ)                          |
| `/colecao`        | Grid de todos os produtos com filtro por categoria                 |
| `/produto/:id`    | Detalhe: galeria, descrição, tamanhos com stock, qty, add carrinho |
| `/admin`          | Painel pra criar/editar/excluir produtos (senha via `.env`)        |

O carrinho fica no localStorage e abre num drawer lateral pelo ícone do header. O botão de finalizar copia a lista pro clipboard e abre o perfil **@vince_kids** no Instagram.

## Cadastrar / editar produtos

Acesse **`/admin`** (a senha vem do `.env`, veja abaixo).

Tudo o que você fizer no admin fica salvo no localStorage do **seu** navegador. **Outros visitantes ainda veem o catálogo padrão** (que vive em código). Pra publicar pra todo mundo:

1. No admin, mexe nos produtos como quiser
2. Clica **Exportar JSON** — baixa um arquivo
3. Abre o arquivo, copia o conteúdo
4. Cola dentro de `client/src/data/products.ts` substituindo o array `DEFAULT_PRODUCTS`
5. Faz commit e push — a Vercel re-deploya sozinha

Botões adicionais no admin:
- **Importar** — carrega um JSON exportado antes (útil pra continuar editando)
- **Resetar** — descarta as alterações locais e volta pro catálogo de código

Se quiser editar direto no código (sem admin), o arquivo é `client/src/data/products.ts`.

## Variável de ambiente

Crie um `.env` na raiz com:

```
VITE_ADMIN_PASSWORD=suasenhaforte
```

Sem essa variável, qualquer um que abrir `/admin` entra. Em produção (Vercel), cadastre essa env var em Settings → Environment Variables.

## Deploy na Vercel

O `vercel.json` já está configurado pra SPA.

1. Sobe o repo no GitHub
2. Importa o repo na Vercel (https://vercel.com/new)
3. Define `VITE_ADMIN_PASSWORD` em Environment Variables
4. Deploy. Pronto.

## Estrutura

```
client/
  index.html
  public/images/        # imagens dos produtos e do site
  src/
    App.tsx             # rotas + CartProvider
    main.tsx
    index.css           # tema (cores, fontes, utilitários)
    components/
      Layout.tsx        # header + footer + drawer mobile
      CartDrawer.tsx    # drawer lateral do carrinho
      ProductCarousel.tsx
      FAQSection.tsx
      SizeGuideModal.tsx
      ErrorBoundary.tsx
      ui/               # button, dialog, card, table, accordion
    context/
      CartContext.tsx   # state do carrinho + persistência
    data/
      products.ts       # ← DEFAULT_PRODUCTS (fonte de prod)
      store.ts          # localStorage get/save/export/import
    hooks/
      useProducts.ts    # hook reativo que reflete edições do admin
    lib/utils.ts
    pages/
      Home.tsx
      Colecao.tsx
      Produto.tsx
      Admin.tsx
      NotFound.tsx
vite.config.ts
tsconfig.json
vercel.json
package.json
```
