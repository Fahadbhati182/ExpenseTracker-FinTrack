import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useExpense } from "@/context/ExpenseContext";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";

export default function AllExpensesPage() {
  const { getUserDetails, user } = useApp();
  const { getUserExpenses, userExpenses, getExpensesFromStorage } = useExpense();

  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [isDateRangeSelected, setIsDateRangeSelected] = useState(false);
  const [isAmountRangeSelected, setIsAmountRangeSelected] = useState(false);

  const filtered = useMemo(() => {
    return userExpenses.filter((e) => {
      const matchesQuery = e.title.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || e.category === category;

      let matchAmountRange;
      let sortedMatchDateRange;

      if (isDateRangeSelected) {
        sortedMatchDateRange = userExpenses.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      }

      if (isAmountRangeSelected) {
        matchAmountRange = userExpenses.sort((a, b) => b.amount - a.amount);
      }

      return (
        matchesQuery &&
        matchesCategory &&
        (matchAmountRange !== undefined ? matchAmountRange : true) &&
        (sortedMatchDateRange !== undefined ? sortedMatchDateRange : true)
      );
    });
  }, [userExpenses, query, category, isAmountRangeSelected, isDateRangeSelected]);

  const total = useMemo(
    () => filtered.reduce((s, e) => s + e.amount, 0),
    [filtered]
  );

  const totalAmountSpent = useMemo(
    () => userExpenses.reduce((s, e) => s + e.amount, 0),
    [userExpenses]
  );

  useEffect(() => {
    getUserExpenses();
    getUserDetails();
    getExpensesFromStorage();
  }, []);

  return user ? (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto w-full space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          All Expenses
        </h1>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4">

        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <FaSearch className="text-[#4de17b] absolute left-4 top-3 text-xl" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title..."
            className="bg-[#1c271f] border-[#203227] pl-12 h-12 text-[#e8f5ee] w-full"
          />
        </div>

        {/* Category Dropdown */}
        <Select onValueChange={(v) => setCategory(v)}>
          <SelectTrigger className="h-12 w-full sm:w-40 bg-[#1c271f] border-[#203227] text-[#e8f5ee]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-[#1c271f] text-white border-[#203227]">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="transport">Transport</SelectItem>
            <SelectItem value="utilities">Utilities</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        {/* Buttons */}
        <Button
          onClick={() => setIsDateRangeSelected((prev) => !prev)}
          className={`h-12 w-full sm:w-auto ${isDateRangeSelected ? "bg-[#3CCD6A]" : "bg-[#1c271f]"
            } border border-[#203227] text-[#e8f5ee] cursor-pointer`}
        >
          Date Range
        </Button>

        <Button
          onClick={() => setIsAmountRangeSelected((prev) => !prev)}
          className={`h-12 w-full sm:w-auto ${isAmountRangeSelected ? "bg-[#3CCD6A]" : "bg-[#1c271f]"
            } border border-[#203227] text-[#e8f5ee] cursor-pointer`}
        >
          Amount Range
        </Button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <Card className="bg-[#1c271f] border border-[#203227] rounded-xl">
          <CardContent className="p-6">
            <p className="text-[#9db9a6]">Total By {category}</p>
            <h2 className="text-3xl text-[#3CCD6A] font-bold mt-2">
              ₹{total.toFixed(2)}
            </h2>
          </CardContent>
        </Card>

        <Card className="bg-[#1c271f] border border-[#203227] rounded-xl">
          <CardContent className="p-6">
            <p className="text-[#9db9a6]">Total This Month</p>
            <h2 className="text-3xl text-[#3CCD6A] font-bold mt-2">
              ₹{totalAmountSpent.toFixed(2)}
            </h2>
          </CardContent>
        </Card>

        <Card className="bg-[#1c271f] border border-[#203227] rounded-xl">
          <CardContent className="p-6">
            <p className="text-[#9db9a6]">Entries Displayed</p>
            <h2 className="text-3xl text-[#3CCD6A] font-bold mt-2">
              {filtered.length}
            </h2>
          </CardContent>
        </Card>

        <Card className="bg-[#1c271f] border border-[#203227] rounded-xl">
          <CardContent className="p-6">
            <p className="text-[#9db9a6]">Total Entries</p>
            <h2 className="text-3xl text-[#3CCD6A] font-bold mt-2">
              {userExpenses.length}
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* TABLE WRAPPER (scrollable on mobile) */}
      <div className="rounded-xl overflow-x-auto border border-[#203227] bg-[#1c271f]">
        <table className="w-full min-w-[600px] text-left">
          <thead className="bg-[#142019]">
            <tr>
              <th className="px-6 py-3 text-xs uppercase tracking-wide text-[#9db9a6]">
                Title
              </th>
              <th className="px-6 py-3 text-xs uppercase tracking-wide text-[#9db9a6]">
                Amount
              </th>
              <th className="px-6 py-3 text-xs uppercase tracking-wide text-[#9db9a6]">
                Category
              </th>
              <th className="px-6 py-3 text-xs uppercase tracking-wide text-[#9db9a6]">
                Date
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#203227]">
            {filtered.map((row) => (
              <tr
                onClick={() => navigate(`/expenses/${row.id}`)}
                key={row.id}
                className="hover:bg-[#16261d] cursor-pointer"
              >
                <td className="px-6 py-4 font-medium text-white">{row.title}</td>
                <td className="px-6 py-4 text-[#9db9a6]">
                  ₹{row.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColor(
                      row.category
                    )}`}
                  >
                    {row.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#9db9a6]">
                  {new Date(row.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <main className="flex-1 p-8 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <h1 className="text-white text-3xl font-bold mb-4">
          Welcome to <span className="text-[#4de17b]">FinTrack!</span>
        </h1>
        <Button
          onClick={() => navigate("/create-profile")}
          className="bg-[#4de17b] text-black cursor-pointer hover:bg-[#3ccd6a] font-semibold px-6"
        >
          Create Profile
        </Button>
      </div>
    </main>
  );
}

// helper for category pill classes
function categoryColor(cat: string) {
  switch (cat.toLowerCase()) {
    case "food":
      return "bg-blue-500/10 text-blue-400";
    case "work":
      return "bg-purple-500/10 text-purple-400";
    case "transport":
      return "bg-orange-500/10 text-orange-400";
    case "shopping":
      return "bg-green-500/10 text-green-400";
    case "utilities":
      return "bg-yellow-500/10 text-yellow-400";
    case "health":
      return "bg-red-500/10 text-red-400";
    case "business":
      return "bg-indigo-500/10 text-indigo-400";
    case "entertainment":
      return "bg-pink-500/10 text-pink-400";
    case "other":
      return "bg-gray-500/10 text-gray-400";
    default:
      return "bg-gray-700/10 text-gray-300";
  }
}
