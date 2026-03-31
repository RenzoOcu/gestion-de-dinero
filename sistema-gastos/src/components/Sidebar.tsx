'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  {
    href: '/dashboard',
    label: 'Resumen',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: '/transactions',
    label: 'Movimientos',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 w-56 shrink-0 border-r border-[#E8E8E4] bg-white flex flex-col h-full 
    transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto 
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  `

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-[#111111]/20 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Logo and close button for mobile */}
        <div className="px-6 py-6 border-b border-[#E8E8E4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#111111] rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="font-semibold text-[15px] text-[#111111] tracking-tight">Finanzas</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-[#A0A09C] hover:text-[#111111] md:hidden transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5" onClick={() => { if(window.innerWidth < 768) onClose(); }}>
          {nav.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#F0F0EC] text-[#111111]'
                    : 'text-[#6B6B6B] hover:bg-[#F7F7F5] hover:text-[#111111]'
                }`}
              >
                <span className={isActive ? 'text-[#111111]' : 'text-[#A0A09C]'}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E8E8E4]">
          <p className="text-xs text-[#A0A09C]">Control financiero personal</p>
        </div>
      </aside>
    </>
  )
}
