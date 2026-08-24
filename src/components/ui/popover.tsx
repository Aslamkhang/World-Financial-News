import { createContext, useContext, useState, useRef, useEffect, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

const PopoverContext = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} })

export function Popover({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return <PopoverContext.Provider value={{ open, setOpen }}>{children}</PopoverContext.Provider>
}

export function PopoverTrigger({ className, children, ...props }: HTMLAttributes<HTMLButtonElement>) {
  const { open, setOpen } = useContext(PopoverContext)
  return <button className={className} onClick={() => setOpen(!open)} {...props}>{children}</button>
}

export function PopoverContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen } = useContext(PopoverContext)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open, setOpen])
  if (!open) return null
  return <div ref={ref} className={cn('z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none', className)} {...props}>{children}</div>
}
