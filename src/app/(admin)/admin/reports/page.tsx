import { getReports, getCustomRangeReport, getMonthRangeReport, type PeriodReport } from "@/actions/get-reports";

function formatRs(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

type Props = {
  searchParams: Promise<{ from?: string; to?: string; month?: string; year?: string }>;
};

export default async function ReportsPage({ searchParams }: Props) {
  const { from, to, month, year } = await searchParams;

  const reports: PeriodReport[] = await getReports();

  let customReport: PeriodReport | null = null;
  let customError: string | null = null;

  if (from && to) {
    if (from > to) {
      customError = "From date To date se pehle honi chahiye";
    } else {
      customReport = await getCustomRangeReport(
        `Custom (${from} - ${to})`,
        from,
        to,
      );
    }
  } else if (month && year) {
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    customReport = await getMonthRangeReport(monthNum, yearNum);
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-foreground">Reports</h1>

      <div className="mb-8 space-y-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            Custom Range
          </h2>
          <form method="GET" className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                From
              </label>
              <input
                type="date"
                name="from"
                defaultValue={from || ""}
                required
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                To
              </label>
              <input
                type="date"
                name="to"
                defaultValue={to || ""}
                required
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Apply
            </button>
          </form>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            Quick Select — Month
          </h2>
          <form method="GET" className="flex flex-wrap items-end gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Month
              </label>
              <select
                name="month"
                defaultValue={month || ""}
                required
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="" disabled>
                  Select month
                </option>
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Year
              </label>
              <input
                type="number"
                name="year"
                min="2024"
                max="2030"
                defaultValue={year || new Date().getFullYear()}
                required
                className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Go
            </button>
          </form>
        </div>
      </div>

      {customError && (
        <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {customError}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {reports.map((r) => (
          <div
            key={r.period}
            className="rounded-lg border border-border bg-card p-6"
          >
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              {r.period}
            </p>
            <p className="mb-1 text-3xl font-bold text-foreground">
              {r.orderCount}
            </p>
            <p className="text-lg font-semibold text-primary">
              {formatRs(r.totalRevenue)}
            </p>
          </div>
        ))}
        {customReport && (
          <div
            key={customReport.period}
            className="rounded-lg border border-primary bg-primary/5 p-6"
          >
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              {customReport.period}
            </p>
            <p className="mb-1 text-3xl font-bold text-foreground">
              {customReport.orderCount}
            </p>
            <p className="text-lg font-semibold text-primary">
              {formatRs(customReport.totalRevenue)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
