'use client'

import { useState } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
import { Sidebar } from '@/components/Sidebar'
import { TransactionForm } from '@/components/TransactionForm'
import { Transaction } from '@/lib/types'

export default function TransactionsPage() {
  const { transactions, loading, refetch, deleteTransaction } = useTransactions()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F7F7F5]">
        <div className="w-10 h-10 border-2 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Eliminar este movimiento?')) {
      await deleteTransaction(id)
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F7F7F5] md:overflow-hidden overflow-y-auto">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className="flex-1 md:overflow-y-auto px-4 md:px-10 py-6 md:py-10">
        {/* Mobile Header */}
        <header className="flex md:hidden items-center justify-between mb-8 pb-4 border-b border-[#E8E8E4] sticky top-0 bg-[#F7F7F5] z-10">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-[#111111]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <span className="font-bold text-lg text-[#111111]">Movimientos</span>
          </div>
          <button 
            onClick={() => {
              setEditingTransaction(null)
              setIsModalOpen(true)
            }}
            className="p-2 bg-[#111111] text-white rounded-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </header>

        <header className="hidden md:flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#111111]">Movimientos</h1>
            <p className="text-[#6B6B6B] mt-1 text-sm font-medium">Historial completo de tus finanzas</p>
          </div>
          <button 
            onClick={() => {
              setEditingTransaction(null)
              setIsModalOpen(true)
            }}
            className="bg-[#111111] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-[#111111]/10 hover:bg-[#333333] transition-all active:scale-95 flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Nuevo movimiento
          </button>
        </header>

        <div className="bg-white border border-[#E8E8E4] rounded-2xl md:rounded-3xl overflow-hidden shadow-sm animate-fade-in">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E8E8E4]">
              <thead className="bg-[#F7F7F5]/50">
                <tr>
                  <th className="px-6 md:px-8 py-5 text-left text-[10px] md:text-xs font-bold text-[#A0A09C] uppercase tracking-widest">Fecha</th>
                  <th className="px-6 md:px-8 py-5 text-left text-[10px] md:text-xs font-bold text-[#A0A09C] uppercase tracking-widest">Categoría</th>
                  <th className="hidden sm:table-cell px-6 md:px-8 py-5 text-left text-[10px] md:text-xs font-bold text-[#A0A09C] uppercase tracking-widest">Descripción</th>
                  <th className="px-6 md:px-8 py-5 text-right text-[10px] md:text-xs font-bold text-[#A0A09C] uppercase tracking-widest">Monto</th>
                  <th className="px-6 md:px-8 py-5 text-right text-[10px] md:text-xs font-bold text-[#A0A09C] uppercase tracking-widest">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E4]">
                {transactions.map((t) => (
                  <tr key={t.id} className="group hover:bg-[#F7F7F5] transition-colors">
                    <td className="px-6 md:px-8 py-4 md:py-5 whitespace-nowrap text-xs md:text-sm font-medium text-[#6B6B6B]">
                      {new Date(t.date + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-5 whitespace-nowrap">
                      <span className="px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold bg-[#F0F0EC] text-[#111111]">
                        {t.category}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-6 md:px-8 py-4 md:py-5 text-xs md:text-sm text-[#A0A09C] italic max-w-xs truncate font-medium">
                      {t.description || "-"}
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-5 whitespace-nowrap text-right text-xs md:text-sm">
                      <span className={`font-black ${t.type === 'income' ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                        {t.type === 'income' ? '+' : '-'} S/ {t.amount}
                      </span>
                    </td>
                    <td className="px-6 md:px-8 py-4 md:py-5 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(t)}
                          className="p-1 px-2 text-[#A0A09C] hover:text-[#111111]"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(t.id)}
                          className="p-1 px-2 text-[#A0A09C] hover:text-[#DC2626]"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center text-xs font-medium text-[#A0A09C] italic">
                      Historial vacío.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Responsivo (Reutilizado del Dashboard) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-[#111111]/30 backdrop-blur-sm animate-fade-in">
            <div className="bg-white sm:rounded-3xl shadow-2xl w-full h-full sm:h-auto max-w-md overflow-hidden border-[#E8E8E4] animate-slide-up flex flex-col">
              <div className="px-6 md:px-8 py-5 md:py-6 border-b border-[#E8E8E4] flex items-center justify-between bg-white shrink-0">
                <h2 className="text-xl font-bold text-[#111111]">{editingTransaction ? 'Editar' : 'Nuevo'} movimiento</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-[#A0A09C] hover:text-[#111111] transition-colors p-2"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="p-6 md:p-8 overflow-y-auto grow">
                <TransactionForm 
                  initialData={editingTransaction}
                  onSuccess={() => {
                    setIsModalOpen(false)
                    refetch()
                  }} 
                  onCancel={() => setIsModalOpen(false)}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
