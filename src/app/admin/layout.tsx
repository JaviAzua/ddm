import { getAdminSession } from "../actions";
import { AdminShell } from "./admin-shell";
import { AdminLoginForm } from "./login-form";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await getAdminSession();

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
        <AdminLoginForm />
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
