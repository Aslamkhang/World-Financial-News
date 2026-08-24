import { cn } from '@/lib/cn'

export function Switch({ className, checked, onCheckedChange, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { onCheckedChange?: (checked: boolean) => void }) {
  return (
    <label className={cn('relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors', checked ? 'bg-primary' : 'bg-input', className)}>
      <span className={cn('pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform', checked ? 'translate-x-4' : 'translate-x-0')} />
      <input type="checkbox" className="sr-only" checked={checked} onChange={e => onCheckedChange?.(e.target.checked)} {...props} />
    </label>
  )
}
