import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { approximateDataURLKB, fileToCompressedDataURL } from "@/lib/imageUpload";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value: string;            // data URL ou caminho (/images/...)
  onChange: (next: string) => void;
  onRemove?: () => void;
  className?: string;
  aspect?: "square" | "video";
  hint?: string;
}

export default function ImageUploader({
  value,
  onChange,
  onRemove,
  className,
  aspect = "square",
  hint,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);
    setLoading(true);
    try {
      const dataUrl = await fileToCompressedDataURL(file);
      onChange(dataUrl);
    } catch (err) {
      setError((err as Error).message || "Erro ao processar imagem");
    } finally {
      setLoading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const sizeKB = value && value.startsWith("data:") ? approximateDataURLKB(value) : null;
  const aspectCls = aspect === "video" ? "aspect-video" : "aspect-square";

  return (
    <div className={cn("w-full", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "relative w-full rounded-2xl border-2 border-dashed transition-colors overflow-hidden",
          aspectCls,
          dragOver
            ? "border-primary bg-primary/5"
            : value
              ? "border-border bg-muted"
              : "border-border bg-muted/40 hover:border-primary/50 hover:bg-primary/5"
        )}
      >
        {value ? (
          <>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            {loading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-1">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="p-2 bg-white rounded-full shadow hover:bg-primary hover:text-white text-foreground/70"
                aria-label="Trocar imagem"
                title="Trocar imagem"
              >
                <Upload className="h-4 w-4" />
              </button>
              {onRemove && (
                <button
                  type="button"
                  onClick={onRemove}
                  className="p-2 bg-white rounded-full shadow hover:bg-destructive hover:text-white text-foreground/70"
                  aria-label="Remover imagem"
                  title="Remover"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary px-4 text-center"
          >
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <ImagePlus className="h-8 w-8" />
            )}
            <span className="text-sm font-bold">Escolher imagem</span>
            <span className="text-[11px]">
              ou arraste aqui · JPG/PNG/WEBP
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onInputChange}
      />

      <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground gap-2">
        <span>{hint ?? "Auto-comprimida pra 1200px, JPEG 85%."}</span>
        {sizeKB !== null && <span className="font-mono">~{sizeKB} KB</span>}
      </div>

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
