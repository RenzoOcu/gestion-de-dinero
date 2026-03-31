'use client'

import { DashboardStats } from '@/lib/types'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

interface Props { stats: DashboardStats }

const PIE_COLORS = ['#111111', '#6B6B6B', '#A0A09C', '#D0D0CC', '#E8E8E4', '#F0F0EC']

const fmt = (n: number) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', minimumFractionDigits: 0 }).format(n)

export function DashboardCharts({ stats }: Props) {
  const expenseData = Object.entries(stats.expensesByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 md:gap-6">
      {/* Cash flow chart — responsive columns */}
      <div className="lg:col-span-4 bg-white border border-[#E8E8E4] rounded-2xl md:rounded-3xl p-5 md:p-6 hover:border-[#D0D0CC] transition-colors shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Flujo mensual</h3>
            <p className="text-[10px] md:text-xs text-[#A0A09C] mt-0.5 italic">Últimos 6 meses</p>
          </div>
          <div className="flex items-center gap-4 text-[10px] md:text-xs text-[#6B6B6B] font-bold">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] inline-block" /> Ingresos
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#DC2626] inline-block" /> Gastos
            </span>
          </div>
        </div>
        <div className="h-[180px] md:h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.monthlyTrend} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16A34A" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DC2626" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="#F0F0EC" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false} tickLine={false}
                tick={{ fill: '#A0A09C', fontSize: 10, fontWeight: 700 }}
                dy={8}
              />
              <YAxis
                axisLine={false} tickLine={false}
                tick={{ fill: '#A0A09C', fontSize: 10, fontWeight: 700 }}
                tickFormatter={(v) => `S/${v}`}
              />
              <Tooltip
                contentStyle={{
                  background: '#fff', border: '1px solid #E8E8E4',
                  borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  fontSize: '11px', padding: '10px 14px',
                }}
                formatter={(v: any) => fmt(Number(v))}
                labelStyle={{ fontWeight: 600, color: '#111', marginBottom: 4 }}
              />
              <Area type="monotone" dataKey="income" name="Ingresos" stroke="#16A34A" strokeWidth={3} fill="url(#gIncome)" dot={false} />
              <Area type="monotone" dataKey="expenses" name="Gastos" stroke="#DC2626" strokeWidth={3} fill="url(#gExpense)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense breakdown — responsive columns */}
      <div className="lg:col-span-3 bg-white border border-[#E8E8E4] rounded-2xl md:rounded-3xl p-5 md:p-6 hover:border-[#D0D0CC] transition-colors shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Gastos por categoría</h3>
          <p className="text-[10px] md:text-xs text-[#A0A09C] mt-0.5 italic">Distribución total</p>
        </div>

        {expenseData.length > 0 ? (
          <>
            <div className="h-[140px] md:h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%" cy="50%"
                    innerRadius={45} outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {expenseData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#fff', border: '1px solid #E8E8E4',
                      borderRadius: '12px', fontSize: '11px', padding: '8px 12px',
                    }}
                    formatter={(v: any) => fmt(Number(v))}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-4">
              {expenseData.slice(0, 5).map((item, i) => {
                const total = expenseData.reduce((s, d) => s + d.value, 0)
                const pct = total > 0 ? (item.value / total * 100).toFixed(0) : '0'
                return (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 max-w-[70%]">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-[10px] font-bold text-[#6B6B6B] truncate lowercase first-letter:uppercase tracking-tight">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-black text-[#111111]">{fmt(item.value)}</span>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-xs font-medium text-[#A0A09C] italic">
            Sin datos.
          </div>
        )}
      </div>
    </div>
  )
}