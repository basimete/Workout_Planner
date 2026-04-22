'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-1.5 rounded-xl font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed select-none'

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-5 py-3 text-sm',
    }

    const variants: Record<string, string> = {
      primary:   'text-white',
      secondary: 'border',
      ghost:     '',
      danger:    'text-red-500 hover:bg-red-50',
    }

    const inlineStyles: Record<string, React.CSSProperties> = {
      primary:   { backgroundColor: '#84cc16' },
      secondary: { backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' },
      ghost:     { color: 'var(--color-muted)' },
      danger:    {},
    }

    return (
      <button
        ref={ref}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        style={inlineStyles[variant]}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
