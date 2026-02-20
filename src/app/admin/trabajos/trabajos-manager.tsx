"use client";

import { useState, useCallback } from "react";
import type { WorkType } from "@/app/data/data";
import Image from "next/image";

type FormWork = WorkType;

const emptyWork = (): FormWork => ({
  id: "",
  title: "",
  location: "",
  materials: [],
  description: "",
  images: [],
});

export function TrabajosManager({ initialWorks }: { initialWorks: WorkType[] }) {
  const [works, setWorks] = useState<WorkType[]>(initialWorks);
  const [editing, setEditing] = useState<FormWork | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormWork>(emptyWork());

  const openEdit = useCallback((work: WorkType) => {
    setEditing(work);
    setForm({ ...work });
    setCreating(false);
  }, []);

  const openCreate = useCallback(() => {
    setCreating(true);
    setForm(emptyWork());
    setEditing(null);
  }, []);

  const closeForm = useCallback(() => {
    setEditing(null);
    setCreating(false);
    setForm(emptyWork());
  }, []);

  const saveEdit = useCallback(() => {
    if (!form.id) return;
    setWorks((prev) =>
      prev.map((w) => (w.id === form.id ? { ...form } : w))
    );
    closeForm();
  }, [form, closeForm]);

  const saveNew = useCallback(() => {
    if (!form.title.trim()) return;
    const newId = String(
      Math.max(0, ...works.map((w) => parseInt(w.id, 10) || 0)) + 1
    );
    setWorks((prev) => [...prev, { ...form, id: newId }]);
    closeForm();
  }, [form, works, closeForm]);

  const deleteWork = useCallback((id: string) => {
    if (confirm("¿Eliminar este trabajo? (solo visual, no se guarda)")) {
      setWorks((prev) => prev.filter((w) => w.id !== id));
      if (editing?.id === id) closeForm();
    }
  }, [editing?.id, closeForm]);

  const updateForm = useCallback(<K extends keyof FormWork>(key: K, value: FormWork[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  }, []);

  const updateMaterials = useCallback((value: string) => {
    setForm((f) => ({
      ...f,
      materials: value.split(",").map((s) => s.trim()).filter(Boolean),
    }));
  }, []);

  const updateImages = useCallback((value: string) => {
    setForm((f) => ({
      ...f,
      images: value
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((url) => ({ url })),
    }));
  }, []);

  const isFormOpen = editing !== null || creating;

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

      <p className="mb-4 text-sm text-base-black/60 dark:text-base-white/60">
        Los cambios son solo visuales y se pierden al recargar. La migración a
        Supabase vendrá después.
      </p>

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
                  className="text-sm text-red-600 dark:text-red-400 underline hover:no-underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-base-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="work-form-title"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-lg">
            <h2 id="work-form-title" className="font-montserrat text-lg font-semibold text-base-black dark:text-base-white">
              {creating ? "Nuevo trabajo" : "Editar trabajo"}
            </h2>
            <form
              className="mt-4 flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                creating ? saveNew() : saveEdit();
              }}
            >
              {!creating && (
                <div>
                  <label className="text-sm font-medium text-base-black/80 dark:text-base-white/80">ID</label>
                  <input
                    type="text"
                    value={form.id}
                    readOnly
                    className="mt-1 w-full rounded border border-[hsl(var(--input))] bg-base-black/5 px-3 py-2 text-sm dark:bg-base-white/5"
                  />
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-base-black/80 dark:text-base-white/80">Título</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  className="mt-1 w-full rounded border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-base-black dark:text-base-white"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-base-black/80 dark:text-base-white/80">Ubicación</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => updateForm("location", e.target.value)}
                  className="mt-1 w-full rounded border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-base-black dark:text-base-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-base-black/80 dark:text-base-white/80">Materiales (separados por coma)</label>
                <input
                  type="text"
                  value={form.materials.join(", ")}
                  onChange={(e) => updateMaterials(e.target.value)}
                  className="mt-1 w-full rounded border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-base-black dark:text-base-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-base-black/80 dark:text-base-white/80">Descripción</label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-base-black dark:text-base-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-base-black/80 dark:text-base-white/80">URLs de imágenes (una por línea)</label>
                <textarea
                  value={form.images.map((i) => i.url).join("\n")}
                  onChange={(e) => updateImages(e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded border border-[hsl(var(--input))] bg-transparent px-3 py-2 font-mono text-sm text-base-black dark:text-base-white"
                />
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  type="submit"
                  className="rounded-md bg-base-black px-4 py-2 text-sm font-medium text-base-white dark:bg-base-white dark:text-base-black"
                >
                  {creating ? "Crear" : "Guardar"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-md border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium text-base-black dark:text-base-white"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
