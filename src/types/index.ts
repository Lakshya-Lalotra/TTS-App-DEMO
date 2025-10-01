// TTS Types
export interface TTSOptions {
  voice?: SpeechSynthesisVoice
  rate?: number
  pitch?: number
  volume?: number
  lang?: string
}

export interface TTSState {
  isPlaying: boolean
  isPaused: boolean
  currentText: string
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  rate: number
  pitch: number
  volume: number
  lang: string
}

// Google TTS Types
export interface GoogleTTSOptions {
  apiKey: string
  text: string
  language?: string
  voice?: string
  speed?: number
  pitch?: number
}

export interface GoogleTTSResponse {
  audioContent: string
}

export interface GoogleTTSState {
  isPlaying: boolean
  isPaused: boolean
  currentText: string
  isLoading: boolean
  error: string | null
  apiKey: string
  selectedLanguage: string
  selectedVoice: string
  speed: number
  pitch: number
}

// Component Types
export type TTSType = 'browser' | 'google'

export interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  icon?: React.ReactNode
  loading?: boolean
  className?: string
}

export interface InputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
  disabled?: boolean
  className?: string
  label?: string
  error?: string
}

export interface SelectProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: Array<{ value: string; label: string }>
  disabled?: boolean
  className?: string
  label?: string
}

export interface SliderProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  label: string
  disabled?: boolean
  className?: string
}
