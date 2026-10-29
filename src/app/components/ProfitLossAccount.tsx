"use client";

import { useRef, useState, type FormEvent } from "react";
import { useReactToPrint } from "react-to-print";

interface ProfitLossAccountLine {
  description: string;
  amount: number;
}

interface ProfitLossAccountDTO {
  fromDate: string;
  toDate: string;
  period: string;
  debit: ProfitLossAccountLine[];
  credit: ProfitLossAccountLine[];
  totalDebit: number;
  totalCredit: number;
  netProfit: number;
  netLoss: number;
}

interface ProfitLossAccountProps {
  username: string;
}

type ReportMode = "monthly" | "datewise";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? ""
).replace(/\/+$/, "");

function getLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentMonth(): string {
  const now = new Date();

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
}

function formatAmount(amount: number | null | undefined): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount ?? 0);
}

export default function ProfitLossAccount({
  username,
}: ProfitLossAccountProps) {
  const today = getLocalDate(new Date());

  const [mode, setMode] = useState<ReportMode>("monthly");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  const [fromDate, setFromDate] = useState(() => {
    const now = new Date();
    return getLocalDate(
      new Date(now.getFullYear(), now.getMonth(), 1)
    );
  });

  const [toDate, setToDate] = useState(today);

  const [report, setReport] =
    useState<ProfitLossAccountDTO | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
  });

  async function handleGenerateReport(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!username?.trim()) {
      setError("Username is required to generate the report.");
      return;
    }

    let from: string;
    let to: string;

    if (mode === "monthly") {
      if (!/^\d{4}-\d{2}$/.test(selectedMonth)) {
        setError("Please select a valid month.");
        return;
      }

      const [year, month] = selectedMonth.split("-").map(Number);

      if (
        !year ||
        month < 1 ||
        month > 12
      ) {
        setError("Please select a valid month.");
        return;
      }

      from = `${selectedMonth}-01`;

      const lastDay = new Date(year, month, 0).getDate();

      to = `${selectedMonth}-${String(lastDay).padStart(2, "0")}`;
    } else {
      from = fromDate;
      to = toDate;
    }

    if (!from || !to) {
      setError("Please select both the start date and end date.");
      return;
    }

    if (from > to) {
      setError("The start date must not be after the end date.");
      return;
    }

    setLoading(true);
    setError("");
    setReport(null);

    try {
      const params = new URLSearchParams({
        username: username.trim(),
        from,
        to,
      });

      const response = await fetch(
        `${API_BASE_URL}/finance/profit-loss-account?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || `Request failed with status ${response.status}`
        );
      }

      const data: ProfitLossAccountDTO = await response.json();

      setReport(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load the profit and loss account."
      );
    } finally {
      setLoading(false);
    }
  }

  const isBalanced = report
    ? Math.abs(
      (report.totalDebit ?? 0) - (report.totalCredit ?? 0)
    ) <= 0.01
    : false;

  function renderAccountSide(
    title: string,
    entries: ProfitLossAccountLine[],
    total: number,
    side: "debit" | "credit"
  ) {
    return (
      <div className="overflow-hidden rounded-xl border border-base-300 bg-base-100">
        <div
          className={`border-b px-4 py-3 ${side === "debit"
              ? "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
              : "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
            }`}
        >
          <h3 className="font-bold">{title}</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Description</th>
                <th className="text-right">Amount (৳)</th>
              </tr>
            </thead>

            <tbody>
              {entries.length > 0 ? (
                entries.map((item, index) => (
                  <tr key={`${item.description}-${index}`}>
                    <td className="whitespace-normal">
                      {item.description}
                    </td>

                    <td className="whitespace-nowrap text-right tabular-nums">
                      {formatAmount(item.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="py-6 text-center text-base-content/60"
                  >
                    No entries
                  </td>
                </tr>
              )}
            </tbody>

            <tfoot>
              <tr className="font-bold">
                <td>Total {title}</td>
                <td className="whitespace-nowrap text-right tabular-nums">
                  {formatAmount(total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          Profit & Loss Account
        </h1>

        <p className="mt-1 text-sm text-base-content/60">
          View your business profit, loss, and expenses for a selected period.
        </p>
      </div>

      {/* Period selection */}
      <form
        onSubmit={handleGenerateReport}
        className="space-y-5 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-6"
      >
        <div>
          <label className="mb-2 block font-semibold">
            Report Type
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={mode === "monthly"}
              onClick={() => {
                setMode("monthly");
                setReport(null);
                setError("");
              }}
              className={`rounded-lg border px-4 py-2 font-medium transition ${mode === "monthly"
                  ? "border-primary bg-primary text-primary-content"
                  : "border-base-300 hover:bg-base-200"
                }`}
            >
              Monthly Report
            </button>

            <button
              type="button"
              aria-pressed={mode === "datewise"}
              onClick={() => {
                setMode("datewise");
                setReport(null);
                setError("");
              }}
              className={`rounded-lg border px-4 py-2 font-medium transition ${mode === "datewise"
                  ? "border-primary bg-primary text-primary-content"
                  : "border-base-300 hover:bg-base-200"
                }`}
            >
              Date-wise Report
            </button>
          </div>
        </div>

        {mode === "monthly" ? (
          <div className="max-w-sm">
            <label
              htmlFor="profit-month"
              className="mb-2 block font-medium"
            >
              Select Month
            </label>

            <input
              id="profit-month"
              type="month"
              required
              value={selectedMonth}
              onChange={(event) => {
                setSelectedMonth(event.target.value);
                setReport(null);
              }}
              className="input input-bordered w-full"
            />

            <p className="mt-2 text-xs text-base-content/60">
              The complete month will be included automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="profit-from"
                className="mb-2 block font-medium"
              >
                From Date
              </label>

              <input
                id="profit-from"
                type="date"
                required
                value={fromDate}
                max={toDate || undefined}
                onChange={(event) => {
                  setFromDate(event.target.value);
                  setReport(null);
                }}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label
                htmlFor="profit-to"
                className="mb-2 block font-medium"
              >
                To Date
              </label>

              <input
                id="profit-to"
                type="date"
                required
                value={toDate}
                min={fromDate || undefined}
                onChange={(event) => {
                  setToDate(event.target.value);
                  setReport(null);
                }}
                className="input input-bordered w-full"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full sm:w-auto"
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm" />
              Generating Report...
            </>
          ) : (
            "Generate Profit & Loss Account"
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-error/30 bg-error/10 p-4 text-error"
        >
          {error}
        </div>
      )}

      {/* Report */}
      {report && (
        <section ref={contentToPrint} className="space-y-5 print:m-10">
          {/* Report heading and period */}
          <div className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">
                  Profit & Loss Statement
                </h2>

                <p className="mt-2 text-sm text-base-content/70">
                  {report.period}
                </p>

                <p className="mt-1 text-xs text-base-content/50 capitalize">
                  {username}
                </p>
              </div>

              <button
                type="button"
                onClick={handlePrint}
                className="btn btn-outline btn-sm print:hidden"
              >
                Print Report
              </button>
            </div>
          </div>

          {/* Net result cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
              <p className="text-sm font-medium text-base-content/70">
                Net Profit
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {formatAmount(report.netProfit)}
              </p>
            </div>

            <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-5">
              <p className="text-sm font-medium text-base-content/70">
                Net Loss
              </p>

              <p className="mt-2 text-2xl font-bold text-rose-700 dark:text-rose-400">
                {formatAmount(report.netLoss)}
              </p>
            </div>
          </div>

          {/* Debit and credit account */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {renderAccountSide(
              "Debit",
              report.debit ?? [],
              report.totalDebit ?? 0,
              "debit"
            )}

            {renderAccountSide(
              "Credit",
              report.credit ?? [],
              report.totalCredit ?? 0,
              "credit"
            )}
          </div>

          {/* Balance check */}
          <div className="rounded-xl border border-base-300 bg-base-100 p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-base-content/60">
                  Total Debit
                </p>

                <p className="mt-1 text-xl font-bold">
                  {formatAmount(report.totalDebit)}
                </p>
              </div>

              <div>
                <p className="text-sm text-base-content/60">
                  Total Credit
                </p>

                <p className="mt-1 text-xl font-bold">
                  {formatAmount(report.totalCredit)}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-base-300 pt-4">
              <p
                className={`font-semibold ${isBalanced
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-rose-700 dark:text-rose-400"
                  }`}
              >
                {isBalanced
                  ? "Debit and credit are balanced."
                  : "Warning: Debit and credit totals do not match."}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}