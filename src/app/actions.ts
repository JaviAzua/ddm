// app/actions.js
"use server";

import { cookies } from "next/headers";

export async function setHasVisited() {
  const cookieStore = await cookies();
  cookieStore.set("hasVisited", "true", {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return { success: true };
}

export async function getHasVisited() {
  const cookieStore = await cookies();
  return cookieStore.has("hasVisited");
}
