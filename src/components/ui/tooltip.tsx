import { createContext, useContext, useState, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

const TooltipContext = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} })

export function Tooltip({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return <TooltipContext.Provider value={{ open, setOpen }}>{children}</TooltipContext.Provider>
}

export function TooltipTrigger({ className, children, ...props }: HTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useContext(TooltipContext)
  return <button className={className} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} {...props}>{children}</button>
}

export function TooltipContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { open } = useContext(TooltipContext)
  if (!open) return null
  return <div className={cn('z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground', className)} {...props}>{children}</div>
}
