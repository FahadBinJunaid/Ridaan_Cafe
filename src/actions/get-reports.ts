"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/supabase/admin-auth";

export type PeriodReport = {
  period: string;
  orderCount: number;
  totalRevenue: number;
};

const PKT_OFFSET = 5 * 60 * 60 * 1000;

function toPKT(date: Date): Date {
  return new Date(date.getTime() + PKT_OFFSET);
}

function fromPKT(date: Date): Date {
  return new Date(date.getTime() - PKT_OFFSET);
}

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

  const nowPKT = toPKT(new Date());

  const todayStart = fromPKT(new Date(Date.UTC(
    nowPKT.getUTCFullYear(),
    nowPKT.getUTCMonth(),
    nowPKT.getUTCDate(),
  )));

  const dayOfWeek = nowPKT.getUTCDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStartPKT = new Date(Date.UTC(
    nowPKT.getUTCFullYear(),
    nowPKT.getUTCMonth(),
    nowPKT.getUTCDate() - diff,
  ));
  const weekStart = fromPKT(weekStartPKT);

  const monthStart = fromPKT(new Date(Date.UTC(
    nowPKT.getUTCFullYear(),
    nowPKT.getUTCMonth(),
    1,
  )));

  const yearStart = fromPKT(new Date(Date.UTC(
    nowPKT.getUTCFullYear(),
    0,
    1,
  )));

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
  fromDate: string,
  toDate: string,
): Promise<PeriodReport> {
  await requireStaff();

  const [fy, fm, fd] = fromDate.split("-").map(Number);
  const [ty, tm, td] = toDate.split("-").map(Number);

  const fromUTC = new Date(Date.UTC(fy, fm - 1, fd) - PKT_OFFSET);
  const toUTC = new Date(Date.UTC(ty, tm - 1, td + 1) - PKT_OFFSET - 1);

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("orders")
    .select("total_amount")
    .gte("created_at", fromUTC.toISOString())
    .lte("created_at", toUTC.toISOString())
    .neq("order_status", "cancelled");

  const orderCount = data?.length ?? 0;
  const totalRevenue = data?.reduce((sum, row) => sum + Number(row.total_amount), 0) ?? 0;

  return { period: label, orderCount, totalRevenue };
}

export async function getMonthRangeReport(
  month: number,
  year: number,
): Promise<PeriodReport> {
  await requireStaff();

  const fromUTC = new Date(Date.UTC(year, month - 1, 1) - PKT_OFFSET);
  const toUTC = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999) - PKT_OFFSET);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const label = `${months[month - 1]} ${year}`;

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("orders")
    .select("total_amount")
    .gte("created_at", fromUTC.toISOString())
    .lte("created_at", toUTC.toISOString())
    .neq("order_status", "cancelled");

  const orderCount = data?.length ?? 0;
  const totalRevenue = data?.reduce((sum, row) => sum + Number(row.total_amount), 0) ?? 0;

  return { period: label, orderCount, totalRevenue };
}
