import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LineChart,
  BarChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { useExpense } from "../context/ExpenseContext";
import type { Expense } from "@/types/Expense";



interface ChartData {
  name: string;
  uv: number;
}

interface CustomizeSizeAndStrokeProps {
  data: ChartData[];
  margin?: { top?: number; right?: number; left?: number; bottom?: number };
}

interface LineChartData {
  week_key: string;
  total_amount_spent: number;
}

/* ---------------- StatCard ---------------- */

function StatCard({
  title,
  value,
  isNegative = false,
}: {
  title: string;
  value: string;
  isNegative?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg p-6 border border-[#3b5443] bg-[#14261a]">
      <p className="text-white text-base font-medium">{title}</p>

      {/* Dynamic color based on overspending */}
      <p
        className={`tracking-light text-3xl font-bold leading-tight ${isNegative ? "text-[#fa5538]" : "text-[#0bda43]"
          }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ---------------- Line Chart ---------------- */

function GenerateLineChart(data: any[]) {
  return (
    <div className="w-full h-[250px] md:h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid stroke="#2a3d31" strokeDasharray="4 4" />

          <XAxis
            dataKey="week_key"
            tick={{ fill: "#9db9a6", fontSize: 12 }}
            stroke="#557565"
          />

          <YAxis tick={{ fill: "#9db9a6", fontSize: 12 }} stroke="#557565" />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0f1d15",
              border: "1px solid #3b5443",
              borderRadius: "8px",
              color: "#9db9a6",
            }}
            labelStyle={{ color: "#4de17b" }}
            itemStyle={{ color: "#9db9a6" }}
          />

          <Legend wrapperStyle={{ color: "#9db9a6", paddingTop: 8 }} />

          <Line
            type="monotone"
            dataKey="total_amount_spent"
            stroke="#4de17b"
            strokeWidth={3}
            dot={{ r: 5, fill: "#4de17b" }}
            activeDot={{ r: 7 }}
            name="Weekly Spend"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------------- Bar Chart ---------------- */

function CustomizeSizeAndStroke({ data, margin }: CustomizeSizeAndStrokeProps) {
  return (
    <div className="w-full h-[260px] md:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={margin}>
          <XAxis dataKey="name" stroke="#3CCD6A" />
          <YAxis />
          <Tooltip wrapperStyle={{ backgroundColor: "#111" }} />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <Bar dataKey="uv" fill="#3CCD6A" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------------- Row Component ---------------- */

function TransactionRow({ tx }: { tx: Expense }) {
  return (
    <div className="flex items-center justify-between border-b border-[#3b5443] py-3">
      <div>
        <p className="text-white font-medium">{tx.title}</p>
        <p className="text-sm text-[#9db9a6]">{tx.category}</p>
      </div>
      <p className="text-white font-bold">₹{tx.amount.toFixed(2)}</p>
    </div>
  );
}

/* ---------------- MAIN PAGE ---------------- */

export default function DashboardPage() {
  const navigate = useNavigate();

  const { isUser, getUserDetails, user } = useApp();
  const {
    userExpenses,
    getExpensesFromStorage,
    getAllCategories,
    calculateMonthlyTotals,
    calculateWeeklyTotals,
  } = useExpense();

  const [categories, setCategories] = useState<ChartData[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<ChartData[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<LineChartData[]>([]);

  /* ---------------- Calculations ---------------- */

  const TotalSpent = useMemo(
    () => userExpenses.reduce((acc, tx) => acc + Math.abs(tx.amount), 0),
    [userExpenses]
  );

  const Budget = user?.monthlyBudget || 0;

  /** NEW LOGIC **/
  const BudgetRemaining = Math.max(0, Budget - TotalSpent);
  const OverspentAmount = Math.max(0, TotalSpent - Budget);

  const AverageDailySpent = useMemo(() => {
    const days = new Date().getDate();
    return TotalSpent / days;
  }, [TotalSpent]);

  useEffect(() => {
    getUserDetails();
    getExpensesFromStorage();
  }, []);

  useEffect(() => {
    const weeklyTotals = calculateWeeklyTotals();
    setWeeklyStats(
      weeklyTotals.map((w) => ({
        week_key: w.week_key,
        total_amount_spent: w.total_amount_spent,
      }))
    );
  }, [calculateWeeklyTotals]);

  useEffect(() => {
    const monthly = calculateMonthlyTotals();
    setMonthlyStats(
      monthly.map((cat) => ({
        name: cat.month_name,
        uv: cat.total_amount_spent,
      }))
    );
  }, [calculateMonthlyTotals]);

  useEffect(() => {
    const cats = getAllCategories();
    setCategories(
      cats.map((cat) => ({
        name: cat.category,
        uv: cat.totalAmount,
      }))
    );
  }, [getAllCategories]);

  /* ---------------- UI ---------------- */

  return isUser ? (
    <main className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Welcome back,<span className="text-[#4de17b]"> {user?.name}! </span>
            </h1>
            <p className="text-[#9db9a6] text-base">
              Here's a summary of your financial activity this month.
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

          <StatCard
            title="Total Spent (This Month)"
            value={`₹${TotalSpent.toFixed(2)}`}
          />

          <StatCard
            title={OverspentAmount > 0 ? "Overspent Amount" : "Budget Remaining"}
            value={
              OverspentAmount > 0
                ? `-₹${OverspentAmount.toFixed(2)}`
                : `₹${BudgetRemaining.toFixed(2)}`
            }
            isNegative={OverspentAmount > 0}
          />

          <StatCard
            title="Average Daily Spend"
            value={`₹${AverageDailySpent.toFixed(2)}`}
          />
        </div>

        {/* Charts & Recent Expenses */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left side charts */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            {/* Weekly Line Chart */}
            <div className="rounded-lg border border-[#3b5443] bg-[#14261a] p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-white text-lg font-bold">Weekly Spending</p>
                  <p className="text-[#9db9a6] text-sm">This Week</p>
                </div>
                <p className="text-[#4de17b] text-2xl font-bold">₹{TotalSpent.toFixed(2)}</p>
              </div>

              {GenerateLineChart(weeklyStats)}
            </div>
            {/* Category Chart */}
            <div className="rounded-lg border border-[#3b5443] bg-[#14261a] p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-white text-lg font-bold">Spending by Category</p>
                  <p className="text-[#9db9a6] text-sm">This Month</p>
                </div>
                <p className="text-[#4de17b] text-2xl font-bold">₹{TotalSpent.toFixed(2)}</p>
              </div>

              {CustomizeSizeAndStroke({
                data: categories,
                margin: { top: 10, right: 30, left: 20, bottom: 5 },
              })}
            </div>

            {/* Monthly Chart */}
            <div className="rounded-lg border border-[#3b5443] bg-[#14261a] p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-white text-lg font-bold">Monthly Budget Usage</p>
                  <p className="text-[#9db9a6] text-sm">This Month</p>
                </div>
                <p className="text-[#4de17b] text-2xl font-bold">₹{TotalSpent.toFixed(2)}</p>
              </div>

              {CustomizeSizeAndStroke({
                data: monthlyStats,
                margin: { top: 10, right: 30, left: 20, bottom: 5 },
              })}
            </div>
          </div>

          {/* Right side - Recent */}
          <div className="rounded-lg border border-[#3b5443] bg-[#14261a] p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-lg font-bold">Recent Expenses</h2>
              <NavLink to="/expenses" className="text-[#4de17b] font-bold hover:underline">
                View All
              </NavLink>
            </div>

            {userExpenses.slice(0, 10).map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}

            {userExpenses.length === 0 && (
              <div className="text-center mt-5 text-[#9db9a6]">No Expenses for now</div>
            )}
          </div>
        </div>
      </div>
    </main>
  ) : (
    <main className="flex-1 p-8 flex items-center justify-center">
      <div className="max-w-md text-center">
        <h1 className="text-white text-3xl font-bold mb-4">
          Welcome to <span className="text-[#4de17b]">FinTrack!</span>
        </h1>
        <Button
          onClick={() => navigate("/create-profile")}
          className="bg-[#4de17b] text-black hover:bg-[#3ccd6a] font-semibold px-6"
        >
          Add Your Details to Get Started
        </Button>
      </div>
    </main>
  );
}
