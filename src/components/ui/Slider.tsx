import React from 'react'
import { SliderProps } from '../../types'
import './Slider.css'

const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min,
  max,
  step,
  label,
  disabled = false,
  className = ''
}) => {
  const sliderClasses = [
    'slider',
    disabled ? 'slider-disabled' : '',
    className
  ].filter(Boolean).join(' ')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value))
  }

  return (
    <div className="slider-group">
      <label className="slider-label">
        {label}: {value}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={sliderClasses}
      />
    </div>
  )
}

export default Slider
