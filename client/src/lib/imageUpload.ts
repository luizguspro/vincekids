/**
 * Compressão de imagem no client (sem upload pra servidor).
 *
 * Recebe um File (do <input type=file>) e devolve um data URL JPEG
 * redimensionado pra caber em maxDim x maxDim mantendo proporção.
 *
 * Como o produto é serializado em JSON (localStorage e export),
 * imagens grandes estouram o storage. Por isso comprimimos sempre.
 */

export interface CompressOptions {
  maxDim?: number; // px do lado mais longo (default 1200)
  quality?: number; // 0..1 (default 0.85)
  mime?: string; // image/jpeg (default) ou image/webp
}

export async function fileToCompressedDataURL(
  file: File,
  opts: CompressOptions = {}
): Promise<string> {
  const { maxDim = 1200, quality = 0.85, mime = "image/jpeg" } = opts;

  if (!file.type.startsWith("image/")) {
    throw new Error("Arquivo não é uma imagem");
  }

  const bitmap = await createImageBitmapSafe(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D não suportado");
  ctx.drawImage(bitmap, 0, 0, width, height);

  // libera memória
  if ("close" in bitmap && typeof (bitmap as ImageBitmap).close === "function") {
    (bitmap as ImageBitmap).close();
  }

  return canvas.toDataURL(mime, quality);
}

async function createImageBitmapSafe(file: File): Promise<ImageBitmap | HTMLImageElement> {
  // Safari antigo / iOS não tem createImageBitmap completo — fallback HTMLImageElement
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      // cai pro fallback
    }
  }
  return await fileToHtmlImage(file);
}

function fileToHtmlImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

export function approximateDataURLKB(dataUrl: string): number {
  // base64 inflaciona ~33%, então (length * 0.75) / 1024
  return Math.round((dataUrl.length * 0.75) / 1024);
}
