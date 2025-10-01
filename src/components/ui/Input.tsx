import React from 'react'
import { InputProps } from '../../types'
import './Input.css'

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  className = '',
  label,
  error
}) => {
  const inputClasses = [
    'input',
    disabled ? 'input-disabled' : '',
    error ? 'input-error' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
      />
      {error && <span className="input-error-text">{error}</span>}
    </div>
  )
}

export default Input
