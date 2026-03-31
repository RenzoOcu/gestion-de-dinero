'use client'

import { useState } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
import { useStats } from '@/hooks/useStats'
import * as XLSX from 'xlsx'
import { format } from 'date-fns'

export default function ReportsPage() {
  const { transactions, loading } = useTransactions()
  const stats = useStats(transactions)
  const [dateRange, setDateRange] = useState({
    start: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  })

  const filteredTransactions = transactions.filter(t => {
    const date = new Date(t.date)
    const start = new Date(dateRange.start)
    const end = new Date(dateRange.end)
    return date >= start && date <= end
  })

  const exportToExcel = () => {
    // Preparar datos para exportación
    const data = filteredTransactions.map(t => ({
      Fecha: new Date(t.date).toLocaleDateString('es-ES'),
      Tipo: t.type === 'income' ? 'Ingreso' : 'Gasto',
      Categoría: t.category,
      Descripción: t.description || '',
      Monto: Number(t.amount)
    }))

    // Agregar resumen
    const summary = [
      { Fecha: 'RESUMEN', Tipo: '', Categoría: '', Descripción: '', Monto: '' },
      { Fecha: 'Total Ingresos', Tipo: '', Categoría: '', Descripción: '', Monto: stats.totalIncome },
      { Fecha: 'Total Gastos', Tipo: '', Categoría: '', Descripción: '', Monto: stats.totalExpenses },
      { Fecha: 'Balance', Tipo: '', Categoría: '', Descripción: '', Monto: stats.balance }
    ]

    const combinedData = [...data, ...summary]

    // Crear worksheet
    const ws = XLSX.utils.json_to_sheet(combinedData)

    // Ajustar anchos de columna
    const colWidths = [
      { wch: 15 }, // Fecha
      { wch: 10 }, // Tipo
      { wch: 20 }, // Categoría
      { wch: 30 }, // Descripción
      { wch: 12 }  // Monto
    ]
    ws['!cols'] = colWidths

    // Crear workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Transacciones')

    // Agregar hoja de estadísticas mensuales
    const monthlyData = stats.monthlyTrend.map(m => ({
      Mes: m.month,
      Ingresos: m.income,
      Gastos: m.expenses,
      Balance: m.income - m.expenses
    }))
    const wsMonthly = XLSX.utils.json_to_sheet(monthlyData)
    wsMonthly['!cols'] = [{ wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }]
    XLSX.utils.book_append_sheet(wb, wsMonthly, 'Tendencia Mensual')

    // Generar archivo
    const fileName = `reporte_financiero_${format(new Date(), 'yyyy-MM-dd')}.xlsx`
    XLSX.writeFile(wb, fileName)
  }

  const exportByCategory = () => {
    // Datos de gastos por categoría
    const expenseData = Object.entries(stats.expensesByCategory).map(([category, amount]) => ({
      Categoría: category,
      Tipo: 'Gasto',
      Monto: amount
    }))

    // Datos de ingresos por categoría
    const incomeData = Object.entries(stats.incomesByCategory).map(([category, amount]) => ({
      Categoría: category,
      Tipo: 'Ingreso',
      Monto: amount
    }))

    const combinedData = [...incomeData, ...expenseData]

    const ws = XLSX.utils.json_to_sheet(combinedData)
    ws['!cols'] = [{ wch: 20 }, { wch: 10 }, { wch: 12 }]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Por Categoría')

    const fileName = `reporte_categorias_${format(new Date(), 'yyyy-MM-dd')}.xlsx`
    XLSX.writeFile(wb, fileName)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
        <p className="text-gray-600 mt-2">Genera y exporta reportes financieros</p>
      </div>

      {/* Filtros de fecha */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Filtrar por período</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha inicio
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha fin
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Resumen del período */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Ingresos</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            ${filteredTransactions
              .filter(t => t.type === 'income')
              .reduce((sum, t) => sum + Number(t.amount), 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Gastos</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">
            ${filteredTransactions
              .filter(t => t.type === 'expense')
              .reduce((sum, t) => sum + Number(t.amount), 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900">Balance</h3>
          <p className={`text-3xl font-bold mt-2 ${
            filteredTransactions.reduce((sum, t) => {
              const amount = Number(t.amount)
              return sum + (t.type === 'income' ? amount : -amount)
            }, 0) >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ${filteredTransactions.reduce((sum, t) => {
              const amount = Number(t.amount)
              return sum + (t.type === 'income' ? amount : -amount)
            }, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Botones de exportación */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Exportar reportes</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={exportToExcel}
            disabled={filteredTransactions.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar Transacciones a Excel
          </button>
          
          <button
            onClick={exportByCategory}
            disabled={Object.keys(stats.expensesByCategory).length === 0 && Object.keys(stats.incomesByCategory).length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Exportar por Categoría
          </button>
        </div>
      </div>

      {/* Vista previa de transacciones */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Vista previa ({filteredTransactions.length} transacciones)</h3>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.slice(0, 20).map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type === 'income' ? 'Ingreso' : 'Gasto'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {transaction.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                    <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                      ${Number(transaction.amount).toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}