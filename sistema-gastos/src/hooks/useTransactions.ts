'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Transaction, TransactionFormData } from '@/lib/types'

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error:', error)
      setError(error.message)
    } else {
      setTransactions(data || [])
    }
    setLoading(false)
  }, [])

  const addTransaction = async (formData: TransactionFormData): Promise<{ error?: string }> => {
    const payload = {
      amount: Number(formData.amount),
      type: formData.type,
      category: formData.category,
      description: formData.description || null,
      date: formData.date,
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert([payload])
      .select()
      .single()

    if (error) {
      console.error('Error adding:', error)
      return { error: error.message }
    }

    setTransactions(prev => [data, ...prev])
    return {}
  }

  const updateTransaction = async (id: string, formData: TransactionFormData): Promise<{ error?: string }> => {
    const payload = {
      amount: Number(formData.amount),
      type: formData.type,
      category: formData.category,
      description: formData.description || null,
      date: formData.date,
    }

    const { data, error } = await supabase
      .from('transactions')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating:', error)
      return { error: error.message }
    }

    setTransactions(prev => prev.map(t => t.id === id ? data : t))
    return {}
  }

  const deleteTransaction = async (id: string): Promise<{ error?: string }> => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting:', error)
      return { error: error.message }
    }

    setTransactions(prev => prev.filter(t => t.id !== id))
    return {}
  }

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  }
}