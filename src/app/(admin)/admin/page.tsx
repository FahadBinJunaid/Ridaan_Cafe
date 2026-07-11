import Link from "next/link";

export default function AdminDashboardPage() {
  const stats = [
    {
      label: "Total Orders Today",
      value: "—",
      href: "/admin/orders",
    },
    {
      label: "Menu Items",
      value: "—",
      href: "/admin/menu",
    },
    {
      label: "Pending Orders",
      value: "—",
      href: "/admin/orders",
    },
    {
      label: "Active Categories",
      value: "—",
      href: "/admin/menu",
    },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-foreground">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg border border-border bg-card p-6 shadow-sm transition-colors hover:bg-accent"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Link
          href="/admin/menu"
          className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Manage Menu
        </Link>
      </div>
    </div>
  );
}
