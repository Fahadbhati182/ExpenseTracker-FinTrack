import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useExpense } from "@/context/ExpenseContext";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";
import type { Expense } from "@/types/Expense";

export default function ExpenseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { expenses, getExpensesFromStorage, deleteExpense } = useExpense();

  const expense: Expense | undefined = expenses.find(
    (e) => e.id === Number(id)
  );

  function handleEdit() {
    navigate(`/add-expense`, { state: { expense } });
  }

  function handleDelete() {
    if (expense) {
      deleteExpense(expense.id);
      navigate("/expenses");
      toast.success("Expense deleted successfully");
    }
  }

  useEffect(() => {
    getExpensesFromStorage();
  }, []);

  return (
    <main className="flex h-full grow flex-col">
      <div className="px-4 sm:px-6 lg:px-10 flex flex-1 justify-center py-6 md:py-10">
        <div className="flex flex-col max-w-3xl flex-1 gap-6">

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2">
            <FaArrowLeft className="text-gray-400" />
            <NavLink
              className="text-gray-400 hover:text-white text-sm font-medium"
              to="/expenses"
            >
              Expenses
            </NavLink>
            <span className="text-gray-500 text-sm">/</span>
            <span className="text-white text-sm font-medium">
              {expense?.title}
            </span>
          </div>

          {/* Expense Card */}
          <Card className="rounded-xl shadow-md bg-white/5 border border-white/10 p-6 md:p-8">
            <CardContent className="p-0">

              {/* Amount & Category */}
              <div className="flex flex-col items-center text-center gap-4 mb-8">
                <p className="text-gray-400 text-sm">Total Amount</p>

                <p className="text-white text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight">
                  ₹{expense?.amount.toFixed(2)}
                </p>

                <div
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-1.5 ${categoryColor(
                    expense?.category || ""
                  )}`}
                >
                  <span className="text-sm font-medium">{expense?.category}</span>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 divide-y divide-white/10">

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 py-4">
                  <p className="text-gray-400 text-sm">Date & Time</p>
                  <p className="text-white text-sm font-medium">
                    {expense?.date}
                  </p>
                </div>

                {/* Description */}
                <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 py-4">
                  <p className="text-gray-400 text-sm">Description</p>
                  <p className="text-white text-sm font-medium">
                    {expense?.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">

                <button
                  onClick={handleEdit}
                  className="flex-1 sm:flex-none cursor-pointer rounded-lg h-12 px-5 bg-[#4de17b] text-black font-bold text-base hover:opacity-90 transition"
                >
                  Edit Expense
                </button>

                <button
                  onClick={handleDelete}
                  className="flex-1 sm:flex-none cursor-pointer rounded-lg h-12 px-5 border border-red-400/50 text-red-400 font-bold text-base hover:bg-red-400/10 transition"
                >
                  Delete Expense
                </button>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

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
