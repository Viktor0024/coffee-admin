/**
 * Публичный URL для файла в Supabase Storage.
 * Если imageUrl уже полный URL (http/https) — возвращаем как есть.
 * Иначе собираем: https://[PROJECT].supabase.co/storage/v1/object/public/[BUCKET]/[path]
 */
const STORAGE_BUCKET =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET) ||
  "images";

export function getPublicStorageUrl(imageUrl: string | undefined | null): string | null {
  if (!imageUrl || typeof imageUrl !== "string") return null;
  const trimmed = imageUrl.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;

  const base = (
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SUPABASE_URL) ||
    ""
  ).replace(/\/$/, "");
  if (!base) return null;

  const path = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
  return `${base}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;
}
