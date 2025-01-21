export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

export interface ExpenseEntry {
  amount: number;
  description: string;
  title: string;
  recurringMonths: number;
  createdAt: string;
}

export interface DayExpenses {
  [date: string]: ExpenseEntry[];
}

export interface Subscription {
  id: number;
  name: string;
  amount: number;
  billingCycle: "monthly" | "yearly";
  nextBillingDate: string;
  description?: string;
}