import React from 'react'
import { SelectProps } from '../../types'
import './Select.css'

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  disabled = false,
  className = '',
  label
}) => {
  const selectClasses = [
    'select',
    disabled ? 'select-disabled' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className="select-group">
      {label && <label className="select-label">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={selectClasses}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select
