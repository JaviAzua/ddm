// app/actions.js
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_SESSION_COOKIE = "admin_session";

export async function setHasVisited() {
  const cookieStore = await cookies();
  cookieStore.set("hasVisited", "true", {
    maxAge: 60 * 60 * 16,
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

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);
  return session?.value === "authenticated";
}

export async function loginAdmin(
  _prev: unknown,
  formData: FormData,
): Promise<{ error?: string }> {
  const user = formData.get("user") as string | null;
  const password = formData.get("password") as string | null;

  const expectedUser = process.env.ADMIN_USER;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return {
      error:
        "Admin no configurado. Definir ADMIN_USER y ADMIN_PASSWORD en .env",
    };
  }

  if (!user?.trim() || !password) {
    return { error: "Usuario y contraseña requeridos" };
  }

  if (user !== expectedUser || password !== expectedPassword) {
    return { error: "Usuario o contraseña incorrectos" };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "authenticated", {
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/admin",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
