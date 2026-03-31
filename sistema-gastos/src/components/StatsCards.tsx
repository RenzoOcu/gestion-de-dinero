'use client'

import { DashboardStats } from '@/lib/types'

interface StatsCardsProps {
  stats: DashboardStats
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 }).format(n)

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Balance',
      value: fmt(stats.balance),
      sub: 'Total acumulado',
      positive: stats.balance >= 0,
      colored: true,
    },
    {
      label: 'Ingresos Mes',
      value: fmt(stats.monthlyIncome),
      sub: `Monto total: ${fmt(stats.totalIncome)}`,
      positive: true,
      colored: false,
    },
    {
      label: 'Gastos Mes',
      value: fmt(stats.monthlyExpenses),
      sub: `Monto total: ${fmt(stats.totalExpenses)}`,
      positive: false,
      colored: false,
    },
    {
      label: 'Ahorro',
      value: `${stats.savingsRate.toFixed(1)}%`,
      sub: stats.savingsRate >= 20 ? '¡Excelente!' : stats.savingsRate > 0 ? 'En progreso' : 'Gastos altos',
      positive: stats.savingsRate >= 20,
      colored: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map(card => (
        <div
          key={card.label}
          className="bg-white border border-[#E8E8E4] rounded-xl md:rounded-2xl p-4 md:p-5 hover:border-[#D0D0CC] transition-colors shadow-sm"
        >
          <p className="text-[10px] md:text-xs font-bold text-[#A0A09C] uppercase tracking-widest mb-2 md:mb-3">{card.label}</p>
          <p className={`text-xl md:text-2xl font-black tracking-tight ${
            card.colored
              ? card.positive ? 'text-[#16A34A]' : 'text-[#DC2626]'
              : 'text-[#111111]'
          }`}>
            {card.value}
          </p>
          <p className="text-[10px] md:text-xs text-[#A0A09C] mt-1 font-medium italic opacity-80">{card.sub}</p>
        </div>
      ))}
    </div>
  )
}