interface BadgeProps {
  label: string
  color?: string
  className?: string
}

export function Badge({ label, color, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${className}`}
      style={color ? { backgroundColor: `${color}22`, color } : {
        backgroundColor: 'var(--color-surface-2)',
        color: 'var(--color-muted)',
      }}
    >
      {label}
    </span>
  )
}
