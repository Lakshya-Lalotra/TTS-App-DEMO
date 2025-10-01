import React from 'react'
import './TextArea.css'

interface TextAreaProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  label?: string
  rows?: number
  error?: string
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder,
  disabled = false,
  className = '',
  label,
  rows = 4,
  error
}) => {
  const textareaClasses = [
    'textarea',
    disabled ? 'textarea-disabled' : '',
    error ? 'textarea-error' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className="textarea-group">
      {label && <label className="textarea-label">{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={textareaClasses}
      />
      {error && <span className="textarea-error-text">{error}</span>}
    </div>
  )
}

export default TextArea
