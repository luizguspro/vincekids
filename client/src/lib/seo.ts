/**
 * SEO helper simples pra SPA.
 *
 * Atualiza title e meta description ao trocar de página.
 * Isso ajuda no browser (aba, histórico) e em crawlers que executam JS
 * (Google moderno consegue). WhatsApp/Facebook NÃO executam JS, então
 * pra preview rico por produto seria necessário SSR.
 */

const DEFAULT_TITLE = "Vince Kids - Moda para Meninos";
const DEFAULT_DESCRIPTION =
  "A loja online dos looks do seu pequeno. Moda, qualidade e carinho para meninos do 1 ao 10.";

export function setPageMeta(title?: string, description?: string) {
  if (typeof document === "undefined") return;

  document.title = title ? `${title} · Vince Kids` : DEFAULT_TITLE;

  const desc = description || DEFAULT_DESCRIPTION;
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement("meta");
    metaDesc.setAttribute("name", "description");
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute("content", desc);
}
