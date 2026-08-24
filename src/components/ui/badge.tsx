import { cn } from '@/lib/cn'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return <div className={cn('inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors', variant === 'default' && 'border-transparent bg-primary text-primary-foreground shadow', variant === 'secondary' && 'border-transparent bg-secondary text-secondary-foreground', variant === 'destructive' && 'border-transparent bg-destructive text-destructive-foreground shadow', variant === 'outline' && 'text-foreground', className)} {...props} />
}
