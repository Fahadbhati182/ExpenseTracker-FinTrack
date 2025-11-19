import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useApp } from './AppContext';
import type { Expense } from '@/types/Expense';


type ExpenseContextType = {
  expenses: Expense[];
  filteredExpenses: Expense[];
  loading: boolean;
  error: string | null;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: number, updatedExpense: Expense) => void;
  deleteExpense: (id: number) => void;
  clearExpenses: () => void;
  getExpensesFromStorage: () => void;
  getAllCategories: () => { category: string; totalAmount: number }[];
  getUserExpenses: () => void;
  userExpenses: Expense[];
  calculateMonthlyTotals: () => MonthlySummary[];
  calculateWeeklyTotals: () => WeeklySummary[];
}

type MonthlySummary = {
  month_name: string;
  total_amount_spent: number;
}

interface WeeklySummary {
  week_key: string;
  total_amount_spent: number;
}


const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: React.ReactNode }) => {

  const { saveItemToLocalStorage, } = useApp()

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [userExpenses, setUserExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);




  // Add a new expense
  const addExpense = useCallback((expense: Expense) => {
    try {
      saveItemToLocalStorage("expenses", [expense, ...expenses]);
      getExpensesFromStorage()
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [expenses]);


  // Get expenses from local storage
  const getExpensesFromStorage = useCallback(() => {
    const storedExpenses = localStorage.getItem("expenses");
    if (storedExpenses) {
      const parseExpense = JSON.parse(storedExpenses)
      setExpenses(parseExpense);
      setFilteredExpenses(parseExpense);
    }
  }, []);

  const getUserExpenses = useCallback(() => {
    const userId = JSON.parse(localStorage.getItem("userDetails") || '{}').id;
    const userExps = expenses.filter(exp => exp.userId === userId);
    console.log(userExps)
    setUserExpenses(userExps);
  }, [expenses]);

  // Update an expense
  const updateExpense = useCallback((id: number, updatedExpense: Expense) => {
    try {
      const expenseIndex = expenses.findIndex(exp => exp.id === id);
      if (expenseIndex === -1) {
        throw new Error("Expense not found");
      }
      const updatedExpenses = [...expenses];
      updatedExpenses[expenseIndex] = { ...updatedExpenses[expenseIndex], ...updatedExpense };
      saveItemToLocalStorage("expenses", updatedExpenses);
      getExpensesFromStorage()
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [expenses]);

  // Delete an expense
  const deleteExpense = useCallback((id: number) => {
    try {
      const expenseToDelete = expenses.find(exp => exp.id === id);
      if (!expenseToDelete) {
        throw new Error("Expense not found");
      }
      const updatedExpenses = expenses.filter(exp => exp.id !== id);
      saveItemToLocalStorage("expenses", updatedExpenses);
      getExpensesFromStorage()
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [expenses]);


  const getAllCategories = useCallback(() => {
    const userExpenses = expenses.filter(exp => exp.userId === (JSON.parse(localStorage.getItem("userDetails") || '{}').id));
    const categories = userExpenses.map((expense) => {
      const category = expense.category;
      const totalCategoriesAmount = userExpenses
        .filter(exp => exp.category === category)
        .reduce((sum, exp) => sum + exp.amount, 0);

      return {
        category,
        totalAmount: totalCategoriesAmount,
      };
    });
    const uniqueCategories: {} = Array.from(new Set(categories.map(cat => cat.category))).map(catName => {
      return categories.find(cat => cat.category === catName)!
    });
    return uniqueCategories;
  }, [expenses])

  const calculateMonthlyTotals = useCallback((): MonthlySummary[] => {
    const monthlyMap = new Map<string, number>();

    for (const expense of userExpenses) {
      // 1. Extract Month Name (e.g., "February 2025")
      const date = new Date(expense.date);
      const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });

      // 2. Sum the amounts
      const currentTotal = monthlyMap.get(monthName) || 0;
      monthlyMap.set(monthName, currentTotal + expense.amount);
    }

    // 3. Convert the Map to the final array format
    const result: MonthlySummary[] = Array.from(monthlyMap.entries()).map(([month_name, total_amount_spent]) => ({
      month_name,
      total_amount_spent: parseFloat(total_amount_spent.toFixed(2)), // Format to 2 decimal places
    }));
    console.log(result)
    return result;
  }, [userExpenses])



  //Helper Function: Get ISO Week Key (YYYY-WW) 
  const getWeekKey = (d: Date): string => {
    const date = new Date(d.getTime());
    date.setDate(date.getDate() + 4 - (date.getDay() || 7)); // ISO week fix

    const yearStart = new Date(date.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    const year = date.getFullYear();
    const weekStr = String(weekNo).padStart(2, '0');

    return `${year}-W${weekStr}`;
  };

  // --- Main Aggregation Function ---
  const calculateWeeklyTotals = useCallback((): WeeklySummary[] => {
    const weeklyMap = new Map<string, number>();

    for (const expense of userExpenses) {
      const weekKey = getWeekKey(new Date(expense.date));
      const currentTotal = weeklyMap.get(weekKey) || 0;
      weeklyMap.set(weekKey, currentTotal + expense.amount);
    }

    return Array.from(weeklyMap.entries()).map(([week_key, total_amount_spent]) => ({
      week_key,
      total_amount_spent: parseFloat(total_amount_spent.toFixed(2)),
    }));
  }, [userExpenses]);

  useEffect(() => {
    if (expenses.length > 0) {
      getUserExpenses();
    }
  }, [expenses, getUserExpenses]);


  // Clear all expenses
  const clearExpenses = useCallback(() => {
    setExpenses([]);
    setFilteredExpenses([]);
  }, []);

  useEffect(() => {
    getExpensesFromStorage();
  }, [])


  const value: any = {
    expenses,
    filteredExpenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    clearExpenses,
    getExpensesFromStorage,
    getAllCategories,
    getUserExpenses,
    userExpenses,
    calculateMonthlyTotals,
    calculateWeeklyTotals
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);

  if (!context) {
    throw new Error('useExpense must be used within ExpenseProvider');
  }

  return context;
};
