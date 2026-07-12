"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/supabase/admin-auth";

export type PeriodReport = {
  period: string;
  orderCount: number;
  totalRevenue: number;
};

async function fetchPeriodData(startDate: Date) {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("orders")
    .select("total_amount")
    .gte("created_at", startDate.toISOString())
    .neq("order_status", "cancelled");

  const orderCount = data?.length ?? 0;
  const totalRevenue = data?.reduce((sum, row) => sum + Number(row.total_amount), 0) ?? 0;

  return { orderCount, totalRevenue };
}

export async function getReports(): Promise<PeriodReport[]> {
  await requireStaff();

  const now = new Date();

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - diff);
  weekStart.setHours(0, 0, 0, 0);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const yearStart = new Date(now.getFullYear(), 0, 1);

  const [today, week, month, year] = await Promise.all([
    fetchPeriodData(todayStart).then((d) => ({ ...d, period: "Today" })),
    fetchPeriodData(weekStart).then((d) => ({ ...d, period: "This Week" })),
    fetchPeriodData(monthStart).then((d) => ({ ...d, period: "This Month" })),
    fetchPeriodData(yearStart).then((d) => ({ ...d, period: "This Year" })),
  ]);

  return [today, week, month, year];
}

export async function getCustomRangeReport(
  label: string,
  fromISO: string,
  toISO: string,
): Promise<PeriodReport> {
  await requireStaff();

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("orders")
    .select("total_amount")
    .gte("created_at", fromISO)
    .lte("created_at", toISO)
    .neq("order_status", "cancelled");

  const orderCount = data?.length ?? 0;
  const totalRevenue = data?.reduce((sum, row) => sum + Number(row.total_amount), 0) ?? 0;

  return { period: label, orderCount, totalRevenue };
}
