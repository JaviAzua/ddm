"use server";

import { createClient } from "@/utils/supabase/server";
import type { WorkType } from "@/app/data/data";

/**
 * Returns works for the hero carousel with only the first image per work.
 */
export async function getWorksForHero(): Promise<WorkType[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("works_with_details")
    .select("*");

  if (error) {
    console.error("getWorksForHero error:", error);
    return [];
  }

  if (!data?.length) return [];

  return (data as WorkType[]).map((w) => ({
    ...w,
    images: w.images?.length ? [w.images[0]] : [],
  }));
}

/**
 * Returns a single work by slug with all images (for modal).
 */
export async function getWorkBySlug(slug: string): Promise<WorkType | null> {
  if (!slug?.trim()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("works_with_details")
    .select("*")
    .eq("id", slug)
    .maybeSingle();

  if (error) {
    console.error("getWorkBySlug error:", error);
    return null;
  }

  return data as WorkType | null;
}
