import React from 'react'

interface FillButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const FillButton: React.FC<FillButtonProps> = ({
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
      className={`rounded-full bg-[var(--ft-primary)] px-8 py-3 text-sm font-medium text-black transition-all duration-600 hover:bg-[var(--ft-btn-hover)] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

export default FillButton
