import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  AlertTriangle,
  Download,
  ImagePlus,
  LogOut,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader";
import { categories, type CategorySlug, type Product, type ProductSize } from "@/data/products";
import {
  exportProductsJSON,
  getProducts,
  hasDraft,
  importProductsJSON,
  resetProducts,
  saveProducts,
} from "@/data/store";
import { fileToCompressedDataURL } from "@/lib/imageUpload";
import { cn } from "@/lib/utils";

const SESSION_KEY = "vk_admin_session";

// Senha fallback fixa caso a env var na Netlify esteja errada ou ausente.
// O admin aceita esta OU a que estiver na VITE_ADMIN_PASSWORD.
const FALLBACK_PASSWORD = "vince3249";

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function emptyProduct(): Product {
  return {
    id: "",
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "camisas",
    sizes: [],
    details: [],
    gallery: [],
  };
}

export default function Admin() {
  const envPassword = (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined)?.trim();
  const validPasswords = [FALLBACK_PASSWORD, envPassword].filter(
    (p): p is string => Boolean(p && p.length > 0)
  );

  const [, navigate] = useLocation();
  const [authed, setAuthed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  });
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const [list, setList] = useState<Product[]>(() => getProducts());
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const draftActive = useMemo(() => hasDraft(), [list]);

  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 2500);
    return () => clearTimeout(t);
  }, [feedback]);

  const persist = (next: Product[]) => {
    setList(next);
    saveProducts(next);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const typed = password.trim();
    if (validPasswords.includes(typed)) {
      setAuthed(true);
      setLoginError(null);
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } else {
      setLoginError("Senha incorreta.");
    }
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    navigate("/");
  };

  const startNew = () => {
    setEditing(emptyProduct());
    setIsNew(true);
  };

  const startEdit = (p: Product) => {
    setEditing({
      ...p,
      sizes: [...p.sizes],
      details: [...(p.details ?? [])],
      gallery: [...(p.gallery ?? [])],
    });
    setIsNew(false);
  };

  const cancelEdit = () => {
    setEditing(null);
    setIsNew(false);
  };

  const saveEdit = () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      setFeedback("Nome é obrigatório");
      return;
    }
    if (!editing.image) {
      setFeedback("Imagem principal é obrigatória");
      return;
    }
    const id = editing.id || slugify(editing.name);
    const product: Product = { ...editing, id };
    let next: Product[];
    if (isNew) {
      if (list.some((p) => p.id === id)) {
        setFeedback("Já existe produto com esse id.");
        return;
      }
      next = [...list, product];
    } else {
      next = list.map((p) => (p.id === editing.id ? product : p));
    }
    try {
      persist(next);
    } catch {
      setFeedback(
        "Não coube no storage. Reduza a galeria ou diminua a qualidade das fotos."
      );
      return;
    }
    setEditing(null);
    setIsNew(false);
    setFeedback(isNew ? "Produto criado" : "Alterações salvas");
  };

  const remove = (id: string) => {
    if (!window.confirm("Apagar este produto?")) return;
    persist(list.filter((p) => p.id !== id));
    setFeedback("Produto removido");
  };

  const handleExport = () => {
    exportProductsJSON(list);
    setFeedback("JSON exportado");
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importProductsJSON(file);
      persist(imported);
      setFeedback(`Importados ${imported.length} produtos`);
    } catch (err) {
      setFeedback("Falha ao importar: " + (err as Error).message);
    } finally {
      e.target.value = "";
    }
  };

  const handleReset = () => {
    if (!window.confirm("Descartar todas as alterações locais e voltar ao catálogo padrão?")) return;
    resetProducts();
    setList(getProducts());
    setFeedback("Restaurado ao padrão");
  };

  if (!authed) {
    return (
      <Layout>
        <section className="container mx-auto px-4 py-20 max-w-md">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <h1 className="font-display text-3xl text-primary mb-2 text-center">Admin</h1>
              <p className="text-sm text-muted-foreground text-center mb-6">Painel restrito.</p>
              <form onSubmit={handleLogin} className="space-y-3">
                <label className="block text-sm font-bold">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:border-primary"
                  placeholder="Digite a senha"
                />
                {loginError && <p className="text-sm text-destructive">{loginError}</p>}
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 rounded-full h-11">
                  Entrar
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap mb-6">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-primary">Admin de Produtos</h1>
            <p className="text-sm text-muted-foreground">
              {list.length} {list.length === 1 ? "produto" : "produtos"}
              {draftActive && (
                <span className="ml-2 inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-xs border border-amber-100">
                  <AlertTriangle className="h-3 w-3" /> alterações locais não publicadas
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={startNew} className="bg-primary hover:bg-primary/90 rounded-full">
              <Plus className="h-4 w-4" /> Novo produto
            </Button>
            <Button onClick={handleExport} variant="outline" className="rounded-full">
              <Download className="h-4 w-4" /> Exportar JSON
            </Button>
            <Button onClick={handleImportClick} variant="outline" className="rounded-full">
              <Upload className="h-4 w-4" /> Importar
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleImport}
            />
            <Button onClick={handleReset} variant="outline" className="rounded-full text-destructive">
              <RotateCcw className="h-4 w-4" /> Resetar
            </Button>
            <Button onClick={handleLogout} variant="ghost" className="rounded-full">
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          </div>
        </div>

        {feedback && (
          <div className="mb-4 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm">
            {feedback}
          </div>
        )}

        <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl text-sm">
          <p className="font-bold text-primary mb-1">Como publicar pra todo mundo</p>
          <p className="text-muted-foreground">
            As alterações ficam salvas só neste navegador. Pra publicar: clique <b>Exportar JSON</b>,
            abra o arquivo baixado, cole o conteúdo em <code>client/src/data/products.ts</code>
            (substituindo o array <code>DEFAULT_PRODUCTS</code>) e dê push no git. A Netlify re-deploya sozinha.
          </p>
        </div>

        {list.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground border border-dashed border-border rounded-2xl">
            Nenhum produto cadastrado. Clique em <b>Novo produto</b>.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((p) => {
              const totalStock = p.sizes.reduce((acc, s) => acc + s.stock, 0);
              return (
                <Card key={p.id}>
                  <CardContent className="p-4 flex gap-4">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-20 h-20 rounded-xl object-cover bg-muted shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{p.id}</p>
                      <p className="text-sm text-primary font-bold">
                        R$ {p.price.toFixed(2).replace(".", ",")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {totalStock} em estoque · {p.sizes.length} tamanhos
                      </p>
                      <div className="mt-2 flex gap-1">
                        <button
                          onClick={() => startEdit(p)}
                          className="p-1.5 rounded-md hover:bg-muted text-foreground/70 hover:text-primary"
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => remove(p.id)}
                          className="p-1.5 rounded-md hover:bg-muted text-foreground/70 hover:text-destructive"
                          aria-label="Apagar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {editing && (
          <EditModal
            product={editing}
            isNew={isNew}
            onChange={setEditing}
            onSave={saveEdit}
            onCancel={cancelEdit}
          />
        )}
      </section>
    </Layout>
  );
}

interface EditModalProps {
  product: Product;
  isNew: boolean;
  onChange: (p: Product) => void;
  onSave: () => void;
  onCancel: () => void;
}

function EditModal({ product, isNew, onChange, onSave, onCancel }: EditModalProps) {
  const set = <K extends keyof Product>(key: K, value: Product[K]) =>
    onChange({ ...product, [key]: value });

  const addSize = () => set("sizes", [...product.sizes, { size: "", stock: 0 }]);
  const updateSize = (i: number, patch: Partial<ProductSize>) =>
    set("sizes", product.sizes.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const removeSize = (i: number) =>
    set("sizes", product.sizes.filter((_, idx) => idx !== i));

  const galleryFileRef = useRef<HTMLInputElement>(null);

  const addGalleryImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const dataUrls: string[] = [];
    for (const file of Array.from(files)) {
      try {
        dataUrls.push(await fileToCompressedDataURL(file));
      } catch {
        // ignora arquivo inválido
      }
    }
    if (dataUrls.length > 0) {
      set("gallery", [...(product.gallery ?? []), ...dataUrls]);
    }
  };

  const updateGalleryAt = (i: number, value: string) => {
    const next = [...(product.gallery ?? [])];
    next[i] = value;
    set("gallery", next);
  };

  const removeGalleryAt = (i: number) =>
    set("gallery", (product.gallery ?? []).filter((_, idx) => idx !== i));

  const detailsText = (product.details ?? []).join("\n");

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
        aria-label="Cancelar"
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <header className="flex items-center justify-between p-4 sm:p-6 border-b border-border/40 sticky top-0 bg-white z-10">
          <h2 className="font-display text-2xl text-primary">
            {isNew ? "Novo produto" : "Editar produto"}
          </h2>
          <button onClick={onCancel} className="p-2 rounded-full hover:bg-muted" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="p-4 sm:p-6 space-y-5">
          <Field label="Nome">
            <input
              value={product.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputCls}
            />
          </Field>

          {!isNew && (
            <Field label="ID (slug)">
              <input
                value={product.id}
                onChange={(e) => set("id", slugify(e.target.value))}
                className={cn(inputCls, "font-mono text-sm")}
              />
            </Field>
          )}

          <Field label="Descrição">
            <textarea
              value={product.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Preço (R$)">
              <input
                type="number"
                step="0.01"
                value={product.price}
                onChange={(e) => set("price", Number(e.target.value))}
                className={inputCls}
              />
            </Field>
            <Field label="Parcelamento (opcional)">
              <input
                value={product.installments ?? ""}
                onChange={(e) => set("installments", e.target.value || undefined)}
                placeholder="ex: 3x de R$ 43,30"
                className={inputCls}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Categoria">
              <select
                value={product.category}
                onChange={(e) => set("category", e.target.value as CategorySlug)}
                className={inputCls}
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Marcar como novo">
              <label className="flex items-center gap-2 h-11">
                <input
                  type="checkbox"
                  checked={!!product.isNew}
                  onChange={(e) => set("isNew", e.target.checked || undefined)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-muted-foreground">Badge "Novo"</span>
              </label>
            </Field>
          </div>

          <Field label="Foto principal">
            <ImageUploader
              value={product.image}
              onChange={(v) => set("image", v)}
              onRemove={() => set("image", "")}
            />
          </Field>

          <Field label="Galeria (opcional)">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {(product.gallery ?? []).map((src, i) => (
                <ImageUploader
                  key={i}
                  value={src}
                  onChange={(v) => updateGalleryAt(i, v)}
                  onRemove={() => removeGalleryAt(i)}
                  hint=" "
                />
              ))}
              <button
                type="button"
                onClick={() => galleryFileRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary text-xs font-bold"
              >
                <ImagePlus className="h-6 w-6" />
                Adicionar
              </button>
              <input
                ref={galleryFileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  void addGalleryImages(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Você pode selecionar várias de uma vez. Cada uma é comprimida automaticamente.
            </p>
          </Field>

          <Field label="Tamanhos e estoque">
            <div className="space-y-2">
              {product.sizes.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    placeholder="Tamanho (ex: 4)"
                    value={s.size}
                    onChange={(e) => updateSize(i, { size: e.target.value })}
                    className={cn(inputCls, "flex-1")}
                  />
                  <input
                    type="number"
                    min={0}
                    value={s.stock}
                    onChange={(e) => updateSize(i, { stock: Number(e.target.value) })}
                    className={cn(inputCls, "w-24")}
                  />
                  <button
                    type="button"
                    onClick={() => removeSize(i)}
                    className="p-2 text-muted-foreground hover:text-destructive"
                    aria-label="Remover"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSize}
                className="text-sm text-primary font-bold inline-flex items-center gap-1 hover:underline"
              >
                <Plus className="h-4 w-4" /> Adicionar tamanho
              </button>
            </div>
          </Field>

          <Field label="Detalhes — um por linha">
            <textarea
              value={detailsText}
              onChange={(e) =>
                set(
                  "details",
                  e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
                )
              }
              rows={4}
              className={inputCls}
              placeholder={"Composição: 100% algodão\nLavagem à máquina"}
            />
          </Field>
        </div>

        <footer className="p-4 sm:p-6 border-t border-border/40 flex gap-2 justify-end sticky bottom-0 bg-white">
          <Button variant="outline" onClick={onCancel} className="rounded-full">
            Cancelar
          </Button>
          <Button onClick={onSave} className="bg-primary hover:bg-primary/90 rounded-full">
            <Save className="h-4 w-4" /> Salvar
          </Button>
        </footer>
      </div>
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-border bg-white focus:outline-none focus:border-primary text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}
