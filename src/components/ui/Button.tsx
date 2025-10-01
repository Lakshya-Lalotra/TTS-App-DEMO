import React from 'react'
import { ButtonProps } from '../../types'
import './Button.css'

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  icon,
  loading = false,
  className = ''
}) => {
  const baseClasses = 'btn'
  const variantClasses = `btn-${variant}`
  const sizeClasses = `btn-${size}`
  const disabledClasses = disabled ? 'btn-disabled' : ''
  const loadingClasses = loading ? 'btn-loading' : ''

  const buttonClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    disabledClasses,
    loadingClasses,
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <div className="btn-spinner" />
      )}
      {icon && !loading && (
        <span className="btn-icon">{icon}</span>
      )}
      <span className="btn-content">{children}</span>
    </button>
  )
}

export default Button
