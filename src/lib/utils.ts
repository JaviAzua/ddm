import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function convertBlobUrlToFile(blobUrl: string): Promise<File> {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const baseName = Math.random().toString(36).slice(2, 9);
  const mimeType = blob.type && blob.type.startsWith("image/") ? blob.type : "image/jpeg";
  const ext = MIME_TO_EXT[mimeType] ?? mimeType.split("/")[1] ?? "jpg";
  return new File([blob], `${baseName}.${ext}`, { type: mimeType });
}
