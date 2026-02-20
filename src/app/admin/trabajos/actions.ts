"use server";

import { createClient } from "@/utils/supabase/server";
import type { WorkType } from "@/app/data/data";

export async function getWorksWithDetails(): Promise<WorkType[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("works_with_details")
    .select("*");

  if (error) {
    console.error("getWorksWithDetails error:", error);
    return [];
  }

  if (!data?.length) return [];

  return data as WorkType[];
}
