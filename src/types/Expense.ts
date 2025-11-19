export interface Expense {
  id: number;
  userId: number;
  title: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
  description?: string;
}