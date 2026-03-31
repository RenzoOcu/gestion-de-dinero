'use client'

import { useMemo } from 'react'
import { Transaction, DashboardStats } from '@/lib/types'
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { es } from 'date-fns/locale'

export function useStats(transactions: Transaction[]): DashboardStats {
  return useMemo(() => {
    const now = new Date()
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    let totalIncome = 0
    let totalExpenses = 0
    let monthlyIncome = 0
    let monthlyExpenses = 0
    const expensesByCategory: Record<string, number> = {}
    const incomesByCategory: Record<string, number> = {}

    transactions.forEach(t => {
      const amount = Number(t.amount)
      const inMonth = isWithinInterval(new Date(t.date + 'T12:00:00'), { start: monthStart, end: monthEnd })

      if (t.type === 'income') {
        totalIncome += amount
        if (inMonth) monthlyIncome += amount
        incomesByCategory[t.category] = (incomesByCategory[t.category] || 0) + amount
      } else {
        totalExpenses += amount
        if (inMonth) monthlyExpenses += amount
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + amount
      }
    })

    const balance = totalIncome - totalExpenses
    const monthlyBalance = monthlyIncome - monthlyExpenses
    const savingsRate = monthlyIncome > 0
      ? Math.max(0, ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100)
      : 0

    // Últimos 6 meses
    const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      const mStart = startOfMonth(date)
      const mEnd = endOfMonth(date)

      const monthTxs = transactions.filter(t =>
        isWithinInterval(new Date(t.date + 'T12:00:00'), { start: mStart, end: mEnd })
      )

      return {
        month: format(date, 'MMM', { locale: es }),
        income: monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0),
        expenses: monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0),
      }
    })

    return {
      totalIncome, totalExpenses, balance,
      monthlyIncome, monthlyExpenses, monthlyBalance,
      savingsRate, expensesByCategory, incomesByCategory, monthlyTrend,
    }
  }, [transactions])
}