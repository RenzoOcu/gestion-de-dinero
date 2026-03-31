'use client'

import { useState, useEffect } from 'react'
import { TransactionFormData, Transaction } from '@/lib/types'
import { useTransactions } from '@/hooks/useTransactions'

interface TransactionFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: Transaction | null
}

export function TransactionForm({ onSuccess, onCancel, initialData }: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    amount: initialData?.amount || '',
    type: initialData?.type || 'expense',
    category: initialData?.category || '',
    description: initialData?.description || '',
    date: initialData?.date || new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const { addTransaction, updateTransaction } = useTransactions()

  const categories = {
    income: ['Salario', 'Freelance', 'Inversiones', 'Ventas', 'Otros'],
    expense: ['Alimentación', 'Transporte', 'Entretenimiento', 'Servicios', 'Salud', 'Educación', 'Hogar', 'Varios']
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    if (!formData.amount || Number(formData.amount) <= 0) {
      setErrorMessage('El monto debe ser mayor a 0')
      setLoading(false)
      return
    }

    if (!formData.category) {
      setErrorMessage('Selecciona una categoría')
      setLoading(false)
      return
    }

    let result
    if (initialData) {
      result = await updateTransaction(initialData.id, formData)
    } else {
      result = await addTransaction(formData)
    }

    setLoading(false)

    if (result && result.error) {
      setErrorMessage(result.error)
    } else {
      onSuccess?.()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && { category: prev.type !== value ? '' : prev.category })
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="flex bg-[#F0F0EC] p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: '' }))}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
            formData.type === 'expense' ? 'bg-white text-[#DC2626] shadow-sm' : 'text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          Gasto
        </button>
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: '' }))}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
            formData.type === 'income' ? 'bg-white text-[#16A34A] shadow-sm' : 'text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          Ingreso
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#A0A09C] uppercase tracking-wider mb-1.5 ml-1">
            Monto (S/)
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            placeholder="0.00"
            required
            className="w-full px-4 py-3 bg-[#F7F7F5] border border-[#E8E8E4] focus:border-[#111111] rounded-xl text-xl font-semibold outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#A0A09C] uppercase tracking-wider mb-1.5 ml-1">
              Categoría
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#F7F7F5] border border-[#E8E8E4] focus:border-[#111111] rounded-xl text-sm font-medium outline-none appearance-none transition-colors"
            >
              <option value="">Seleccionar</option>
              {categories[formData.type].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#A0A09C] uppercase tracking-wider mb-1.5 ml-1">
              Fecha
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#F7F7F5] border border-[#E8E8E4] focus:border-[#111111] rounded-xl text-sm font-medium outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#A0A09C] uppercase tracking-wider mb-1.5 ml-1">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={2}
            placeholder="Añade una descripción..."
            className="w-full px-4 py-3 bg-[#F7F7F5] border border-[#E8E8E4] focus:border-[#111111] rounded-xl text-sm font-medium outline-none resize-none transition-colors"
          />
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 text-[#DC2626] text-xs font-bold rounded-lg border border-red-100 italic">
          {errorMessage}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-white border border-[#E8E8E4] text-[#6B6B6B] rounded-xl font-bold text-sm hover:bg-[#F7F7F5] transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-[2] py-3 px-4 bg-[#111111] text-white rounded-xl font-bold text-sm hover:bg-[#333333] transition-all disabled:opacity-50"
        >
          {loading ? 'Procesando...' : initialData ? 'Actualizar' : 'Guardar movimiento'}
        </button>
      </div>
    </form>
  )
}