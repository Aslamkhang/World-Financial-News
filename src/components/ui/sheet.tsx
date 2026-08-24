import { createContext, useContext, useState, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { X } from 'lucide-react'

const SheetContext = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} })

export function Sheet({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return <SheetContext.Provider value={{ open, setOpen }}>{children}</SheetContext.Provider>
}

export function SheetTrigger({ className, children, ...props }: HTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useContext(SheetContext)
  return <button className={className} onClick={() => setOpen(true)} {...props}>{children}</button>
}

export function SheetContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen } = useContext(SheetContext)
  if (!open) return null
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)} />
      <div ref={null} className={cn('fixed inset-y-0 right-0 z-50 h-full w-3/4 max-w-sm border-l bg-background p-6 shadow-lg transition-transform', className)} {...props}>
        <button className="absolute right-4 top-4" onClick={() => setOpen(false)}><X size={16} /></button>
        {children}
      </div>
    </>
  )
}
