import Link from "next/link";
import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/supabase/admin-auth";
import AdminLogoutButton from "@/components/shared/admin-logout-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let staff: { name: string; email: string; role: string };
  try {
    staff = await requireStaff();
  } catch {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-col border-r border-border bg-card p-4">
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-lg font-bold text-primary"
          >
            Admin Panel
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">
            Rindaan Cafe
          </p>
        </div>

        <nav className="flex-1 space-y-1">
          <Link
            href="/admin"
            className="block rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/menu"
            className="block rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Menu
          </Link>
          <Link
            href="/admin/reports"
            className="block rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
          >
            Reports
          </Link>
        </nav>

        <div className="border-t border-border pt-4">
          <div className="mb-3 space-y-1">
            <p className="text-sm font-medium text-foreground">
              {staff.name}
            </p>
            <p className="text-xs text-muted-foreground">{staff.email}</p>
            <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {staff.role}
            </span>
          </div>
          <AdminLogoutButton />
        </div>
      </aside>

      <main className="flex-1 bg-background p-8">{children}</main>
    </div>
  );
}
