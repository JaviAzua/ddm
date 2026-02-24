"use client";

import {
  useState,
  useCallback,
  useTransition,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";
import type { WorkType } from "@/app/data/data";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import {
  uploadImage,
  deleteImage,
  deleteFolder,
} from "@/utils/supabase/storage/client";
import { convertBlobUrlToFile } from "@/lib/utils";
import { revalidateWorksCache } from "@/app/actions/works";

const BUCKET_ASSETS = "assets";

type FormWork = WorkType;

const emptyWork = (): FormWork => ({
  id: "",
  title: "",
  location: "",
  materials: [],
  description: "",
  images: [],
});

function slugFromTitle(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return base || "work";
}

function ensureUniqueSlug(slug: string, existing: string[]): string {
  if (!existing.includes(slug)) return slug;
  let n = 1;
  while (existing.includes(`${slug}-${n}`)) n++;
  return `${slug}-${n}`;
}

export function TrabajosManager({
  initialWorks,
}: {
  initialWorks: WorkType[];
}) {
  const [works, setWorks] = useState<WorkType[]>(initialWorks);
  const [editing, setEditing] = useState<FormWork | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormWork>(emptyWork());
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const initialImageUrlsRef = useRef<string[]>([]);

  const [locationsList, setLocationsList] = useState<string[]>([]);
  const [materialsList, setMaterialsList] = useState<string[]>([]);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [materialsPickerOpen, setMaterialsPickerOpen] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [newMaterialName, setNewMaterialName] = useState("");
  const [locationDropdownRect, setLocationDropdownRect] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const [materialsDropdownRect, setMaterialsDropdownRect] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const locationTriggerRef = useRef<HTMLButtonElement>(null);
  const materialsTriggerRef = useRef<HTMLButtonElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const materialsDropdownRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  const isFormOpen = editing !== null || creating;

  useEffect(() => {
    if (isFormOpen) {
      modalContentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      const firstEditable = modalContentRef.current?.querySelector<
        HTMLInputElement | HTMLTextAreaElement
      >("input:not([readonly]), textarea");
      firstEditable?.focus({ preventScroll: true });
    }
  }, [isFormOpen]);

  useLayoutEffect(() => {
    if (
      locationPickerOpen &&
      locationTriggerRef.current &&
      typeof window !== "undefined"
    ) {
      const rect = locationTriggerRef.current.getBoundingClientRect();
      setLocationDropdownRect({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    } else {
      setLocationDropdownRect(null);
    }
  }, [locationPickerOpen]);

  useLayoutEffect(() => {
    if (
      materialsPickerOpen &&
      materialsTriggerRef.current &&
      typeof window !== "undefined"
    ) {
      const rect = materialsTriggerRef.current.getBoundingClientRect();
      setMaterialsDropdownRect({
        top: rect.bottom + 4,
        left: rect.left,
      });
    } else {
      setMaterialsDropdownRect(null);
    }
  }, [materialsPickerOpen]);

  useEffect(() => {
    const closeOnClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        locationPickerOpen &&
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(target) &&
        locationTriggerRef.current &&
        !locationTriggerRef.current.contains(target)
      ) {
        setLocationPickerOpen(false);
      }
      if (
        materialsPickerOpen &&
        materialsDropdownRef.current &&
        !materialsDropdownRef.current.contains(target) &&
        materialsTriggerRef.current &&
        !materialsTriggerRef.current.contains(target)
      ) {
        setMaterialsPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnClickOutside);
    return () => document.removeEventListener("mousedown", closeOnClickOutside);
  }, [locationPickerOpen, materialsPickerOpen]);

  const openEdit = useCallback((work: WorkType) => {
    setLocationPickerOpen(false);
    setMaterialsPickerOpen(false);
    setEditing(work);
    setForm({ ...work });
    setCreating(false);
    setError(null);
    initialImageUrlsRef.current = work.images
      .map((img) => img.url)
      .filter((url) => url && !url.startsWith("blob:"));
  }, []);

  const openCreate = useCallback(() => {
    setLocationPickerOpen(false);
    setMaterialsPickerOpen(false);
    setCreating(true);
    setForm(emptyWork());
    setEditing(null);
    setError(null);
    initialImageUrlsRef.current = [];
  }, []);

  const closeForm = useCallback(() => {
    setLocationPickerOpen(false);
    setMaterialsPickerOpen(false);
    setEditing(null);
    setCreating(false);
    setForm(emptyWork());
    setError(null);
  }, []);

  const ensureLocation = useCallback(
    async (
      name: string,
    ): Promise<{ id: string | null; error: string | null }> => {
      const trimmed = name.trim();
      if (!trimmed) return { id: null, error: null };
      const { data: existing } = await supabase
        .from("locations")
        .select("id")
        .eq("name", trimmed)
        .maybeSingle();
      if (existing?.id) return { id: existing.id, error: null };
      const { data: inserted, error: insertErr } = await supabase
        .from("locations")
        .insert({ name: trimmed })
        .select("id")
        .single();
      if (!insertErr) return { id: inserted?.id ?? null, error: null };
      if (insertErr.code === "23505") {
        const { data: byName } = await supabase
          .from("locations")
          .select("id")
          .eq("name", trimmed)
          .maybeSingle();
        return { id: byName?.id ?? null, error: null };
      }
      return {
        id: null,
        error: insertErr.message ?? "Error al guardar la ubicación",
      };
    },
    [supabase],
  );

  const ensureMaterials = useCallback(
    async (
      names: string[],
    ): Promise<{ ids: string[]; error: string | null }> => {
      const ids: string[] = [];
      for (const name of names) {
        const trimmed = name.trim();
        if (!trimmed) continue;
        const { data: existing } = await supabase
          .from("materials")
          .select("id")
          .eq("name", trimmed)
          .maybeSingle();
        if (existing?.id) {
          ids.push(existing.id);
          continue;
        }
        const { data: inserted, error: insertErr } = await supabase
          .from("materials")
          .insert({ name: trimmed })
          .select("id")
          .single();
        if (!insertErr && inserted?.id) {
          ids.push(inserted.id);
          continue;
        }
        if (insertErr?.code === "23505") {
          const { data: byName } = await supabase
            .from("materials")
            .select("id")
            .eq("name", trimmed)
            .maybeSingle();
          if (byName?.id) ids.push(byName.id);
          continue;
        }
        return {
          ids,
          error: insertErr?.message ?? "No se pudieron guardar los materiales.",
        };
      }
      return { ids, error: null };
    },
    [supabase],
  );

  const resolveImageUrls = useCallback(
    async (
      images: { url: string }[],
      workSlug: string,
    ): Promise<{ urls: string[]; uploadError: string | null }> => {
      const resolved: string[] = [];
      let uploadError: string | null = null;
      const folder = `trabajos/${workSlug}`;
      for (const { url } of images) {
        if (!url) continue;
        if (url.startsWith("blob:")) {
          try {
            const file = await convertBlobUrlToFile(url);
            const { imageUrl, error: uploadErr } = await uploadImage({
              file,
              bucket: BUCKET_ASSETS,
              folder,
            });
            if (uploadErr) {
              if (!uploadError) uploadError = uploadErr;
              continue;
            }
            resolved.push(imageUrl);
          } catch (e) {
            const msg = e instanceof Error ? e.message : "Error al subir imagen";
            if (!uploadError) uploadError = msg;
          }
        } else {
          resolved.push(url);
        }
      }
      return { urls: resolved, uploadError };
    },
    [],
  );

  const saveNew = useCallback(() => {
    if (!form.title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    startTransition(async () => {
      setError(null);
      const { id: locationId, error: locationError } =
        await ensureLocation(form.location);
      if (locationError) {
        setError(locationError);
        return;
      }
      if (!locationId && form.location.trim()) {
        setError("No se pudo guardar la ubicación.");
        return;
      }
      if (!locationId) {
        setError("La ubicación es obligatoria.");
        return;
      }
      const { ids: materialIds, error: materialsError } =
        await ensureMaterials(form.materials);
      if (materialsError) {
        setError(materialsError);
        return;
      }
      const existingSlugs = works.map((w) => w.id);
      const slug = ensureUniqueSlug(slugFromTitle(form.title), existingSlugs);

      const { urls: imageUrls, uploadError: imageUploadError } =
        await resolveImageUrls(form.images, slug);
      if (imageUploadError) {
        setError(`Imágenes: ${imageUploadError}`);
        return;
      }

      const { data: workRow, error: workErr } = await supabase
        .from("works")
        .insert({
          slug,
          title: form.title.trim(),
          location_id: locationId,
          description: form.description?.trim() ?? "",
        })
        .select("id")
        .single();

      if (workErr) {
        setError(workErr.message || "Error al crear el trabajo.");
        return;
      }
      const workId = workRow?.id;
      if (!workId) {
        setError("Error al crear el trabajo.");
        return;
      }

      if (imageUrls.length) {
        await supabase.from("work_images").insert(
          imageUrls.map((url, i) => ({
            work_id: workId,
            url,
            sort_order: i,
          })),
        );
      }
      if (materialIds.length) {
        const { error: wmErr } = await supabase
          .from("work_materials")
          .insert(
            materialIds.map((material_id) => ({
              work_id: workId,
              material_id,
            })),
          );
        if (wmErr) {
          setError(wmErr.message ?? "Error al guardar los materiales.");
          return;
        }
      }

      setWorks((prev) => [
        ...prev,
        {
          id: slug,
          title: form.title.trim(),
          location: form.location.trim(),
          materials: form.materials,
          description: form.description?.trim() ?? "",
          images: imageUrls.map((url) => ({ url })),
        },
      ]);
      closeForm();
      await revalidateWorksCache();
    });
  }, [
    form,
    works,
    supabase,
    ensureLocation,
    ensureMaterials,
    resolveImageUrls,
    closeForm,
  ]);

  const saveEdit = useCallback(() => {
    if (!form.id) return;
    startTransition(async () => {
      setError(null);
      const { data: workRow } = await supabase
        .from("works")
        .select("id")
        .eq("slug", form.id)
        .single();
      const workId = workRow?.id;
      if (!workId) {
        setError("Trabajo no encontrado.");
        return;
      }

      const { id: locationId, error: locationError } =
        await ensureLocation(form.location);
      if (locationError) {
        setError(locationError);
        return;
      }
      if (!locationId && form.location.trim()) {
        setError("No se pudo guardar la ubicación.");
        return;
      }
      if (!locationId) {
        setError("La ubicación es obligatoria.");
        return;
      }
      const { ids: materialIds, error: materialsError } =
        await ensureMaterials(form.materials);
      if (materialsError) {
        setError(materialsError);
        return;
      }
      const { urls: imageUrls, uploadError: imageUploadError } =
        await resolveImageUrls(form.images, form.id);
      if (imageUploadError) {
        setError(`Imágenes: ${imageUploadError}`);
        return;
      }

      const urlsToDeleteFromStorage = initialImageUrlsRef.current.filter(
        (url) => !imageUrls.includes(url),
      );
      for (const url of urlsToDeleteFromStorage) {
        const { error: delErr } = await deleteImage(url);
        if (delErr) console.error("Failed to delete image from storage:", delErr);
      }

      const { error: workErr } = await supabase
        .from("works")
        .update({
          title: form.title.trim(),
          location_id: locationId,
          description: form.description?.trim() ?? "",
        })
        .eq("id", workId);

      if (workErr) {
        setError(workErr.message || "Error al guardar.");
        return;
      }

      await supabase.from("work_images").delete().eq("work_id", workId);
      if (imageUrls.length) {
        await supabase.from("work_images").insert(
          imageUrls.map((url, i) => ({
            work_id: workId,
            url,
            sort_order: i,
          })),
        );
      }

      await supabase.from("work_materials").delete().eq("work_id", workId);
      if (materialIds.length) {
        const { error: wmErr } = await supabase
          .from("work_materials")
          .insert(
            materialIds.map((material_id) => ({
              work_id: workId,
              material_id,
            })),
          );
        if (wmErr) {
          setError(wmErr.message ?? "Error al guardar los materiales.");
          return;
        }
      }

      setWorks((prev) =>
        prev.map((w) =>
          w.id === form.id
            ? {
                id: form.id,
                title: form.title.trim(),
                location: form.location.trim(),
                materials: form.materials,
                description: form.description?.trim() ?? "",
                images: imageUrls.map((url) => ({ url })),
              }
            : w,
        ),
      );
      closeForm();
      await revalidateWorksCache();
    });
  }, [
    form,
    supabase,
    ensureLocation,
    ensureMaterials,
    resolveImageUrls,
    closeForm,
  ]);

  const deleteWork = useCallback(
    (slug: string) => {
      if (!confirm("¿Eliminar este trabajo?")) return;
      startTransition(async () => {
        setError(null);
        const { error: folderErr } = await deleteFolder(
          BUCKET_ASSETS,
          `trabajos/${slug}`,
        );
        if (folderErr) {
          console.error("Failed to delete work folder from storage:", folderErr);
        }
        const { error: delErr } = await supabase
          .from("works")
          .delete()
          .eq("slug", slug);
        if (delErr) {
          setError(delErr.message || "Error al eliminar.");
          return;
        }
        setWorks((prev) => prev.filter((w) => w.id !== slug));
        if (editing?.id === slug) closeForm();
        await revalidateWorksCache();
      });
    },
    [supabase, editing?.id, closeForm],
  );

  const updateForm = useCallback(
    <K extends keyof FormWork>(key: K, value: FormWork[K]) => {
      setForm((f) => ({ ...f, [key]: value }));
    },
    [],
  );

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) return;
      const files = Array.from(e.target.files);
      const blobUrls = files.map((f) => URL.createObjectURL(f));
      setForm((f) => ({
        ...f,
        images: [...f.images, ...blobUrls.map((url) => ({ url }))],
      }));
      e.target.value = "";
    },
    [],
  );

  const removeImage = useCallback((index: number) => {
    setForm((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
    }));
  }, []);

  const fetchLocations = useCallback(async () => {
    const { data } = await supabase
      .from("locations")
      .select("name")
      .order("name");
    setLocationsList((data?.map((r) => r.name) as string[]) ?? []);
  }, [supabase]);

  const fetchMaterials = useCallback(async () => {
    const { data } = await supabase
      .from("materials")
      .select("name")
      .order("name");
    setMaterialsList((data?.map((r) => r.name) as string[]) ?? []);
  }, [supabase]);

  const openLocationPicker = useCallback(() => {
    setLocationPickerOpen(true);
    setNewLocationName("");
    fetchLocations();
  }, [fetchLocations]);

  const openMaterialsPicker = useCallback(() => {
    setMaterialsPickerOpen(true);
    setNewMaterialName("");
    fetchMaterials();
  }, [fetchMaterials]);

  const selectLocation = useCallback(
    (name: string) => {
      updateForm("location", name);
      setLocationPickerOpen(false);
    },
    [updateForm],
  );

  const createAndSelectLocation = useCallback(
    async (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const { error: insertErr } = await supabase
        .from("locations")
        .insert({ name: trimmed })
        .select("id")
        .single();
      if (!insertErr) setLocationsList((prev) => [...prev, trimmed].sort());
      if (insertErr && insertErr.code !== "23505") {
        setError(insertErr.message ?? "No se pudo crear la ubicación.");
      }
      selectLocation(trimmed);
    },
    [supabase, selectLocation],
  );

  const addMaterial = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setForm((f) => ({
      ...f,
      materials: f.materials.includes(trimmed)
        ? f.materials
        : [...f.materials, trimmed],
    }));
  }, []);

  const createAndAddMaterial = useCallback(
    async (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const { error: insertErr } = await supabase
        .from("materials")
        .insert({ name: trimmed });
      if (!insertErr) setMaterialsList((prev) => [...prev, trimmed].sort());
      addMaterial(trimmed);
      setMaterialsPickerOpen(false);
      setNewMaterialName("");
    },
    [supabase, addMaterial],
  );

  const removeMaterial = useCallback((index: number) => {
    setForm((f) => ({
      ...f,
      materials: f.materials.filter((_, i) => i !== index),
    }));
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-montserrat text-2xl font-semibold text-base-black dark:text-base-white">
          Trabajos
        </h1>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-md bg-base-black px-4 py-2 text-sm font-medium text-base-white hover:opacity-90 dark:bg-base-white dark:text-base-black"
        >
          Nuevo trabajo
        </button>
      </div>

      {error && !isFormOpen && (
        <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {works.map((work) => (
          <li
            key={work.id}
            className="overflow-hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
          >
            <div className="relative aspect-video bg-base-gray/10">
              {work.images[0]?.url ? (
                <Image
                  src={work.images[0].url}
                  alt={work.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-base-black/40 dark:text-base-white/40">
                  Sin imagen
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="font-medium text-base-black dark:text-base-white">
                {work.title}
              </p>
              <p className="text-sm text-base-black/70 dark:text-base-white/70">
                {work.location} · {work.materials.join(", ")}
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(work)}
                  className="text-sm text-[hsl(var(--primary))] underline hover:no-underline"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => deleteWork(work.id)}
                  disabled={isPending}
                  className="text-sm text-red-600 dark:text-red-400 underline hover:no-underline disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        multiple
        hidden
        onChange={handleImageChange}
        disabled={isPending}
      />

      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-base-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="work-form-title"
        >
          <div
            ref={modalContentRef}
            tabIndex={-1}
            onScroll={() => {
              setLocationPickerOpen(false);
              setMaterialsPickerOpen(false);
            }}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-lg outline-none"
          >
            <h2
              id="work-form-title"
              className="font-montserrat text-lg font-semibold text-base-black dark:text-base-white"
            >
              {creating ? "Nuevo trabajo" : "Editar trabajo"}
            </h2>
            {error && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            <form
              className="mt-4 flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                creating ? saveNew() : saveEdit();
              }}
            >
              {!creating && (
                <div>
                  <label className="text-sm font-medium text-base-black/80 dark:text-base-white/80">
                    Slug (solo lectura)
                  </label>
                  <input
                    type="text"
                    value={form.id}
                    readOnly
                    className="mt-1 w-full rounded border border-[hsl(var(--input))] bg-base-black/5 px-3 py-2 text-sm dark:bg-base-white/5"
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-base-black/80 dark:text-base-white/80">
                  Título
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  className="mt-1 w-full rounded border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-base-black dark:text-base-white"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-base-black/80 dark:text-base-white/80">
                  Ubicación
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="min-h-9 flex-1 rounded border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-base-black dark:text-base-white">
                    {form.location || "—"}
                  </span>
                  <button
                    ref={locationTriggerRef}
                    type="button"
                    onClick={openLocationPicker}
                    disabled={isPending}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-[hsl(var(--input))] bg-transparent text-lg text-base-black dark:text-base-white disabled:opacity-50"
                    title="Elegir o crear ubicación"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-base-black/80 dark:text-base-white/80">
                  Materiales
                </label>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {form.materials.map((name, index) => (
                    <span
                      key={`${name}-${index}`}
                      className="inline-flex items-center gap-1 rounded-full border border-[hsl(var(--border))] bg-base-black/5 px-2 py-1 text-sm dark:bg-base-white/5"
                    >
                      {name}
                      <button
                        type="button"
                        onClick={() => removeMaterial(index)}
                        className="rounded p-0.5 hover:bg-base-black/10 dark:hover:bg-base-white/10"
                        aria-label={`Quitar ${name}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    ref={materialsTriggerRef}
                    type="button"
                    onClick={openMaterialsPicker}
                    disabled={isPending}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--input))] bg-transparent text-base text-base-black dark:text-base-white disabled:opacity-50"
                    title="Elegir o crear material"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-base-black/80 dark:text-base-white/80">
                  Descripción
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-base-black dark:text-base-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-base-black/80 dark:text-base-white/80">
                  Imágenes (bucket: assets)
                </label>
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isPending}
                  className="mt-1 rounded border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-sm text-base-black dark:text-base-white disabled:opacity-50"
                >
                  Añadir imágenes
                </button>
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.images.map((img, index) => (
                    <div
                      key={index}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded border border-[hsl(var(--border))]"
                    >
                      <Image
                        src={img.url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized={img.url.startsWith("blob:")}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-1 top-1 rounded bg-base-black/70 px-1.5 py-0.5 text-xs text-white hover:bg-base-black"
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-md bg-base-black px-4 py-2 text-sm font-medium text-base-white dark:bg-base-white dark:text-base-black disabled:opacity-50"
                >
                  {isPending ? "Guardando…" : creating ? "Crear" : "Guardar"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={isPending}
                  className="rounded-md border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium text-base-black dark:text-base-white disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {typeof document !== "undefined" &&
        locationPickerOpen &&
        locationDropdownRect &&
        createPortal(
          <div
            ref={locationDropdownRef}
            className="fixed z-[100] w-[208px] rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-1 shadow-xl"
            style={{
              top: locationDropdownRect.top,
              right: locationDropdownRect.right,
              left: "auto",
            }}
          >
            <div className="max-h-48 overflow-y-auto">
              {locationsList.length === 0 && (
                <p className="px-3 py-2 text-sm text-base-black/60 dark:text-base-white/60">
                  Sin ubicaciones. Crea una abajo.
                </p>
              )}
              {locationsList.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => selectLocation(name)}
                  className="w-full px-3 py-2 text-left text-sm text-base-black hover:bg-base-black/10 dark:text-base-white dark:hover:bg-base-white/10"
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="border-t border-[hsl(var(--border))] px-2 py-2">
              <p className="mb-1 text-xs text-base-black/70 dark:text-base-white/70">
                Crear nueva
              </p>
              <div className="flex gap-1 flex-wrap items-center">
                <input
                  type="text"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      createAndSelectLocation(newLocationName);
                    }
                  }}
                  placeholder="Nombre"
                  className="min-w-0 flex-1 rounded border border-[hsl(var(--input))] bg-transparent px-2 py-1 text-sm text-base-black dark:text-base-white"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    createAndSelectLocation(newLocationName);
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="shrink-0 rounded bg-base-black px-2 py-1 text-sm text-base-white dark:bg-base-white dark:text-base-black"
                >
                  Añadir
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {typeof document !== "undefined" &&
        materialsPickerOpen &&
        materialsDropdownRect &&
        createPortal(
          <div
            ref={materialsDropdownRef}
            className="fixed z-[100] w-[208px] rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] py-1 shadow-xl"
            style={{
              top: materialsDropdownRect.top,
              left: materialsDropdownRect.left,
              right: "auto",
            }}
          >
            <div className="max-h-48 overflow-y-auto">
              {materialsList.length === 0 && (
                <p className="px-3 py-2 text-sm text-base-black/60 dark:text-base-white/60">
                  Sin materiales. Crea uno abajo.
                </p>
              )}
              {materialsList.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    addMaterial(name);
                    setMaterialsPickerOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-base-black hover:bg-base-black/10 dark:text-base-white dark:hover:bg-base-white/10"
                >
                  {name}
                </button>
              ))}
            </div>
            <div className="border-t border-[hsl(var(--border))] px-2 py-2">
              <p className="mb-1 text-xs text-base-black/70 dark:text-base-white/70">
                Crear nuevo
              </p>
              <div className="flex gap-1 flex-wrap">
                <input
                  type="text"
                  value={newMaterialName}
                  onChange={(e) => setNewMaterialName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      createAndAddMaterial(newMaterialName);
                    }
                  }}
                  placeholder="Nombre"
                  className="flex-1 rounded border border-[hsl(var(--input))] bg-transparent px-2 py-1 text-sm text-base-black dark:text-base-white"
                />
                <button
                  type="button"
                  onClick={() => createAndAddMaterial(newMaterialName)}
                  className="rounded bg-base-black px-2 py-1 text-sm text-base-white dark:bg-base-white dark:text-base-black"
                >
                  Añadir
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
