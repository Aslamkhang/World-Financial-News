import { useState, createContext, useContext, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { ChevronDown } from 'lucide-react'

const AccordionContext = createContext<{ open: string; setOpen: (v: string) => void }>({ open: '', setOpen: () => {} })

export function Accordion({ children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const [open, setOpen] = useState('')
  return <AccordionContext.Provider value={{ open, setOpen }}><div {...props}>{children}</div></AccordionContext.Provider>
}

export function AccordionItem({ value, className, children, ...props }: HTMLAttributes<HTMLDivElement> & { value: string }) {
  return <div className={cn('border-b', className)} {...props}>{children}</div>
}

export function AccordionTrigger({ value, className, children, ...props }: HTMLAttributes<HTMLButtonElement> & { value: string }) {
  const { open, setOpen } = useContext(AccordionContext)
  const isOpen = open === value
  return (
    <button className={cn('flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline', className)} onClick={() => setOpen(isOpen ? '' : value)} {...props}>
      {children}
      <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
    </button>
  )
}

export function AccordionContent({ value, className, children, ...props }: HTMLAttributes<HTMLDivElement> & { value: string }) {
  const { open } = useContext(AccordionContext)
  if (open !== value) return null
  return <div className={cn('pb-4 text-sm', className)} {...props}>{children}</div>
}
