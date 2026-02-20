import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";
import { createClient } from "../client";

function getStorage() {
  const { storage } = createClient();
  return storage;
}

type UploadProps = {
  file: File;
  bucket: string;
  folder?: string;
  maxSizeMB?: number;
};

function getFileExtension(file: File): string {
  const name = file.name;
  if (name.includes(".")) {
    const ext = name.slice(name.lastIndexOf(".") + 1).toLowerCase();
    if (ext && /^[a-z0-9]+$/.test(ext)) return ext;
  }
  const mime = file.type?.toLowerCase() ?? "";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  return "jpg";
}

export const uploadImage = async ({
  file,
  bucket,
  folder,
  maxSizeMB = 2,
}: UploadProps) => {
  if (!file || !bucket) {
    return { imageUrl: "", error: "Missing file or bucket" };
  }

  const ext = getFileExtension(file);
  const path = `${folder ? folder + "/" : ""}${uuidv4()}.${ext}`;

  let fileToUpload = file;
  try {
    fileToUpload = await imageCompression(file, { maxSizeMB });
  } catch {
    fileToUpload = file;
  }

  const storage = getStorage();
  if (!storage) {
    return { imageUrl: "", error: "Storage not initialized" };
  }

  const { data, error } = await storage.from(bucket).upload(path, fileToUpload, {
    contentType: fileToUpload.type || file.type,
  });

  if (error) {
    return { imageUrl: "", error: error.message };
  }
  if (!data?.path) {
    return { imageUrl: "", error: "No path returned from upload" };
  }

  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${data.path}`;
  return { imageUrl, error: "" };
};

export const deleteImage = async (imageUrl: string) => {
  if (!imageUrl) {
    return { data: null, error: "No image URL provided" };
  }

  const storage = getStorage();
  if (!storage) {
    return { data: null, error: "Storage not initialized" };
  }

  const bucketAndPathString = imageUrl.split("/storage/v1/object/public/")[1];
  if (!bucketAndPathString) {
    return { data: null, error: "Invalid image URL" };
  }

  const firstSlashIndex = bucketAndPathString.indexOf("/");
  if (firstSlashIndex === -1) {
    return { data: null, error: "Invalid image URL format" };
  }

  const bucket = bucketAndPathString.slice(0, firstSlashIndex);
  const path = bucketAndPathString.slice(firstSlashIndex + 1);

  const { data, error } = await storage.from(bucket).remove([path]);
  return { data, error };
};

/**
 * List all file paths under a folder (recursive) and remove them.
 * Use for deleting a work's folder: deleteFolder("assets", "trabajos/my-slug")
 */
export const deleteFolder = async (
  bucket: string,
  folderPath: string,
): Promise<{ error: string | null }> => {
  const storage = getStorage();
  if (!storage) {
    return { error: "Storage not initialized" };
  }

  const prefix = folderPath.replace(/\/$/, "");
  const paths: string[] = [];

  const listRecursive = async (path: string): Promise<void> => {
    const { data, error } = await storage.from(bucket).list(path, {
      limit: 1000,
    });
    if (error) return;
    for (const item of data ?? []) {
      const fullPath = path ? `${path}/${item.name}` : item.name;
      const isFolder = "id" in item ? item.id == null : true;
      if (isFolder) {
        await listRecursive(fullPath);
      } else {
        paths.push(fullPath);
      }
    }
  };

  await listRecursive(prefix);
  if (paths.length === 0) return { error: null };

  const { error } = await storage.from(bucket).remove(paths);
  return { error: error?.message ?? null };
};
