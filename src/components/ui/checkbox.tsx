import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input type="checkbox" ref={ref} className={cn('h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', className)} {...props} />
  ),
)
