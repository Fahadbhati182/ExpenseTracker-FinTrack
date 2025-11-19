import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useExpense } from "@/context/ExpenseContext";
import toast from "react-hot-toast";
import { useApp } from "@/context/AppContext";
import type { Expense } from "@/types/Expense";

export default function AddExpensePage() {
  const { addExpense, updateExpense } = useExpense();
  const { user, getUserDetails } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const expenseToBeEdited = location.state?.expense;

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!title || !amount || !category || !date) {
      alert("Please fill in all required fields.");
      return;
    }

    if (expenseToBeEdited) {
      const updatedExpense: Expense = {
        ...expenseToBeEdited,
        title,
        amount: parseFloat(amount),
        category,
        date,
        description,
      };
      updateExpense(expenseToBeEdited.id, updatedExpense);
      navigate("/expenses");
      toast.success("Expense updated successfully");
      return;
    }

    const newExpense: Expense = {
      id: Date.now(),
      title,
      amount: parseFloat(amount),
      category,
      date,
      description,
      createdAt: new Date().toISOString(),
      userId: user?.id || 1,
    };

    addExpense(newExpense);
    navigate("/expenses");
    toast.success("Expense added successfully");

    setAmount("");
    setCategory("");
    setDate("");
    setDescription("");
    setTitle("");
  };

  useEffect(() => {
    if (expenseToBeEdited) {
      setTitle(expenseToBeEdited.title);
      setAmount(expenseToBeEdited.amount.toString());
      setCategory(expenseToBeEdited.category);
      setDate(expenseToBeEdited.date);
      setDescription(expenseToBeEdited.description);
    }
  }, [expenseToBeEdited]);

  useEffect(() => {
    getUserDetails()
  }, [])

  return user ? (
    <div className="flex w-full min-h-screen bg-[#0e1510] text-white px-4 sm:px-6 lg:px-12 py-8">
      <main className="flex-1 w-full">

        <div className="max-w-4xl mx-auto w-full">

          {/* Breadcrumb */}
          <div className="text-xs sm:text-sm flex gap-2 text-[#9db9a6] mb-4">
            <span>Expenses</span> <span>/</span>
            <span className="text-white">
              {expenseToBeEdited ? "Edit Expense" : "Add New Expense"}
            </span>
          </div>

          {/* Page Title */}
          <h1 className="text-3xl sm:text-4xl font-black mb-8">
            {expenseToBeEdited ? "Edit Expense" : "Add a New Expense"}
          </h1>

          <Card className="bg-[#111813] border border-[#2a3a30] text-white w-full">
            <CardContent className="p-6 sm:p-8 space-y-6">

              {/* Title + Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Title */}
                <div>
                  <p className="pb-2">What you bought</p>
                  <Input
                    placeholder="e.g., Lunch with Client"
                    className="bg-[#1c271f] border-[#3b5443] text-white"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Amount */}
                <div>
                  <p className="pb-2">How much you spent</p>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-[#9db9a6]">₹</span>
                    <Input
                      type="number"
                      placeholder="0.00"
                      className="pl-8 bg-[#1c271f] border-[#3b5443] text-white"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Category + Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Category */}
                <div>
                  <p className="pb-2">Category</p>
                  <Select onValueChange={setCategory} value={category}>
                    <SelectTrigger className="bg-[#1c271f] border-[#3b5443] text-white">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1c271f] text-white border-[#3b5443]">
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date */}
                <div>
                  <p className="pb-2">Date</p>
                  <Input
                    type="date"
                    className="bg-[#1c271f] border-[#3b5443] text-white"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="pb-2">Description (Optional)</p>
                <Textarea
                  placeholder="Add details..."
                  className="bg-[#1c271f] border-[#3b5443] text-white"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row-reverse gap-4 pt-4">

                <Button
                  className="bg-[#4de17b] text-black hover:bg-[#3ccd6a] cursor-pointer font-bold px-8 h-14"
                  onClick={handleSubmit}
                >
                  {expenseToBeEdited ? "Update Expense" : "Add Expense"}
                </Button>

                {!expenseToBeEdited && (
                  <Button
                    onClick={() => navigate("/")}
                    variant="ghost"
                    className="text-[#9db9a6] cursor-pointer h-14"
                  >
                    Cancel
                  </Button>
                )}

              </div>

            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  ) : (
    <div className="flex items-center justify-center w-full min-h-screen bg-[#0e1510] text-white px-4 sm:px-6 lg:px-12 py-8">
      <p className="text-lg">Please log in to add or edit expenses.</p>
    </div>
  );
}
