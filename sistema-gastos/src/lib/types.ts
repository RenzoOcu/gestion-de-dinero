export interface Transaction {
  id: string
  user_id?: string
  amount: number
  type: 'income' | 'expense'
  category: string
  description: string | null
  date: string
  created_at: string
}

export interface TransactionFormData {
  amount: number | string
  type: 'income' | 'expense'
  category: string
  description: string
  date: string
}

export interface DashboardStats {
  totalIncome: number
  totalExpenses: number
  balance: number
  monthlyIncome: number
  monthlyExpenses: number
  monthlyBalance: number
  savingsRate: number
  expensesByCategory: Record<string, number>
  incomesByCategory: Record<string, number>
  monthlyTrend: { month: string; income: number; expenses: number }[]
}