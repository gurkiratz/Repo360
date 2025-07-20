import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Trophy, Star, Award, Crown } from 'lucide-react'

interface AchievementBadgeProps {
  level: 'bronze' | 'silver' | 'gold' | 'diamond'
  title: string
  description?: string
  className?: string
  animated?: boolean
}

export function AchievementBadge({
  level,
  title,
  description,
  className,
  animated = true,
}: AchievementBadgeProps) {
  const levelConfig = {
    bronze: {
      color: 'text-achievement-bronze',
      bgColor: 'bg-achievement-bronze/10',
      borderColor: 'border-achievement-bronze',
      icon: Award,
      glow: 'achievement-glow',
    },
    silver: {
      color: 'text-achievement-silver',
      bgColor: 'bg-achievement-silver/10',
      borderColor: 'border-achievement-silver',
      icon: Star,
      glow: 'achievement-glow',
    },
    gold: {
      color: 'text-achievement-gold',
      bgColor: 'bg-achievement-gold/10',
      borderColor: 'border-achievement-gold',
      icon: Trophy,
      glow: 'achievement-glow',
    },
    diamond: {
      color: 'text-achievement-diamond',
      bgColor: 'bg-achievement-diamond/10',
      borderColor: 'border-achievement-diamond',
      icon: Crown,
      glow: 'achievement-glow',
    },
  }

  const config = levelConfig[level]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300',
        config.bgColor,
        config.borderColor,
        config.color,
        animated && 'hover:' + config.glow,
        animated && 'animate-achievement-bounce',
        className
      )}
    >
      <Icon className="w-4 h-4" />
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{title}</span>
        {description && (
          <span className="text-xs opacity-80">{description}</span>
        )}
      </div>
    </div>
  )
}
