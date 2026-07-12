import { createServiceClient } from "@/lib/supabase/server";
import AdminOrderDashboard from "@/components/shared/admin-order-dashboard";

type OrderRow = {
  id: string;
  reference_number: string;
  customer_name: string;
  customer_phone: string;
  order_status: string;
  total_amount: number;
  created_at: string;
};

const PAGE_SIZE = 20;

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const searchQuery = (q || "").trim();

  const supabase = createServiceClient();

  let query = supabase
    .from("orders")
    .select("id, reference_number, customer_name, customer_phone, order_status, total_amount, created_at", { count: "exact" })
    .order("created_at", { ascending: false });

  if (searchQuery) {
    query = query.or(
      `customer_name.ilike.%${searchQuery}%,customer_phone.ilike.%${searchQuery}%`,
    );
  }

  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);

  const { data: orders, count: totalOrders } = await query;

  const totalPages = totalOrders ? Math.ceil(totalOrders / PAGE_SIZE) : 1;

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-foreground">Orders</h1>
      <AdminOrderDashboard
        initialOrders={(orders as OrderRow[]) || []}
        totalPages={totalPages}
        currentPage={currentPage}
        searchQuery={searchQuery}
      />
    </div>
  );
}
