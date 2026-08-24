import { createContext, useContext, useState, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { X } from 'lucide-react'

const DialogContext = createContext<{ open: boolean; setOpen: (v: boolean) => void }>({ open: false, setOpen: () => {} })

export function Dialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>
}

export function DialogTrigger({ className, children, ...props }: HTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useContext(DialogContext)
  return <button className={className} onClick={() => setOpen(true)} {...props}>{children}</button>
}

export function DialogContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen } = useContext(DialogContext)
  if (!open) return null
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)} />
      <div className={cn('fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg', className)} {...props}>
        <button className="absolute right-4 top-4" onClick={() => setOpen(false)}><X size={16} /></button>
        {children}
      </div>
    </>
  )
}

export function DialogHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
}

export function DialogTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
}
