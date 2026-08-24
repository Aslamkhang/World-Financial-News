import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={max}
      className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}
      {...props}
    >
      <div className="h-full w-full flex-1 bg-primary transition-all" style={{ transform: `translateX(-${100 - (value / max) * 100}%)` }} />
    </div>
  ),
)
