import React from 'react'

interface StrokeButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const StrokeButton: React.FC<StrokeButtonProps> = ({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border-1 border-[var(--ft-primary)] bg-transparent px-8 py-3 text-sm font-medium text-[var(--ft-primary)] transition-all duration-600 hover:border-[var(--ft-primary)] hover:text-[var(--ft-primary)] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

export default StrokeButton
