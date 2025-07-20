import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  variant?: 'default' | 'xp' | 'level' | 'achievement'
  showValue?: boolean
  animated?: boolean
}

export function ProgressBar({
  value,
  max = 100,
  className,
  variant = 'default',
  showValue = false,
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const variantStyles = {
    default: 'bg-primary',
    xp: 'bg-xp',
    level:
      'bg-gradient-to-r from-level-beginner via-level-intermediate to-level-expert',
    achievement:
      'bg-gradient-to-r from-achievement-bronze via-achievement-silver to-achievement-gold',
  }

  const backgroundStyles = {
    default: 'bg-muted',
    xp: 'bg-muted',
    level: 'bg-muted',
    achievement: 'bg-muted',
  }

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'h-3 rounded-full overflow-hidden',
          backgroundStyles[variant]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000 ease-out relative',
            variantStyles[variant],
            animated && 'animate-progress-fill',
            variant === 'xp' && 'animate-glow-pulse'
          )}
          style={{ width: `${percentage}%` }}
        >
          {variant === 'achievement' && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-sparkle" />
          )}
        </div>
      </div>
      {showValue && (
        <div className="absolute right-0 -top-6 text-xs font-semibold text-muted-foreground">
          {value}/{max}
        </div>
      )}
    </div>
  )
}
