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

export const GOOGLE_VOICES = {
  'en-US': [
    { value: 'en-US-Wavenet-A', label: 'Wavenet A (Male)' },
    { value: 'en-US-Wavenet-B', label: 'Wavenet B (Male)' },
    { value: 'en-US-Wavenet-C', label: 'Wavenet C (Female)' },
    { value: 'en-US-Wavenet-D', label: 'Wavenet D (Male)' },
    { value: 'en-US-Wavenet-E', label: 'Wavenet E (Female)' },
    { value: 'en-US-Wavenet-F', label: 'Wavenet F (Female)' },
    { value: 'en-US-Standard-A', label: 'Standard A (Male)' },
    { value: 'en-US-Standard-B', label: 'Standard B (Male)' },
    { value: 'en-US-Standard-C', label: 'Standard C (Female)' },
    { value: 'en-US-Standard-D', label: 'Standard D (Male)' },
    { value: 'en-US-Standard-E', label: 'Standard E (Female)' },
    { value: 'en-US-Standard-F', label: 'Standard F (Female)' }
  ],
  'hi-IN': [
    { value: 'hi-IN-Wavenet-A', label: 'Wavenet A (Female)' },
    { value: 'hi-IN-Wavenet-B', label: 'Wavenet B (Male)' },
    { value: 'hi-IN-Wavenet-C', label: 'Wavenet C (Female)' },
    { value: 'hi-IN-Wavenet-D', label: 'Wavenet D (Male)' },
    { value: 'hi-IN-Standard-A', label: 'Standard A (Female)' },
    { value: 'hi-IN-Standard-B', label: 'Standard B (Male)' },
    { value: 'hi-IN-Standard-C', label: 'Standard C (Female)' },
    { value: 'hi-IN-Standard-D', label: 'Standard D (Male)' }
  ],
  'es-ES': [
    { value: 'es-ES-Wavenet-A', label: 'Wavenet A (Female)' },
    { value: 'es-ES-Wavenet-B', label: 'Wavenet B (Male)' },
    { value: 'es-ES-Wavenet-C', label: 'Wavenet C (Female)' },
    { value: 'es-ES-Standard-A', label: 'Standard A (Female)' },
    { value: 'es-ES-Standard-B', label: 'Standard B (Male)' }
  ],
  'fr-FR': [
    { value: 'fr-FR-Wavenet-A', label: 'Wavenet A (Female)' },
    { value: 'fr-FR-Wavenet-B', label: 'Wavenet B (Male)' },
    { value: 'fr-FR-Wavenet-C', label: 'Wavenet C (Female)' },
    { value: 'fr-FR-Standard-A', label: 'Standard A (Female)' },
    { value: 'fr-FR-Standard-B', label: 'Standard B (Male)' }
  ],
  'de-DE': [
    { value: 'de-DE-Wavenet-A', label: 'Wavenet A (Female)' },
    { value: 'de-DE-Wavenet-B', label: 'Wavenet B (Male)' },
    { value: 'de-DE-Wavenet-C', label: 'Wavenet C (Female)' },
    { value: 'de-DE-Standard-A', label: 'Standard A (Female)' },
    { value: 'de-DE-Standard-B', label: 'Standard B (Male)' }
  ],
  'ja-JP': [
    { value: 'ja-JP-Wavenet-A', label: 'Wavenet A (Female)' },
    { value: 'ja-JP-Wavenet-B', label: 'Wavenet B (Male)' },
    { value: 'ja-JP-Wavenet-C', label: 'Wavenet C (Female)' },
    { value: 'ja-JP-Standard-A', label: 'Standard A (Female)' },
    { value: 'ja-JP-Standard-B', label: 'Standard B (Male)' }
  ],
  'ko-KR': [
    { value: 'ko-KR-Wavenet-A', label: 'Wavenet A (Female)' },
    { value: 'ko-KR-Wavenet-B', label: 'Wavenet B (Male)' },
    { value: 'ko-KR-Wavenet-C', label: 'Wavenet C (Female)' },
    { value: 'ko-KR-Standard-A', label: 'Standard A (Female)' },
    { value: 'ko-KR-Standard-B', label: 'Standard B (Male)' }
  ],
  'zh-CN': [
    { value: 'zh-CN-Wavenet-A', label: 'Wavenet A (Female)' },
    { value: 'zh-CN-Wavenet-B', label: 'Wavenet B (Male)' },
    { value: 'zh-CN-Wavenet-C', label: 'Wavenet C (Female)' },
    { value: 'zh-CN-Standard-A', label: 'Standard A (Female)' },
    { value: 'zh-CN-Standard-B', label: 'Standard B (Male)' }
  ],
  'ar-SA': [
    { value: 'ar-XA-Wavenet-A', label: 'Wavenet A (Female)' },
    { value: 'ar-XA-Wavenet-B', label: 'Wavenet B (Male)' },
    { value: 'ar-XA-Wavenet-C', label: 'Wavenet C (Female)' },
    { value: 'ar-XA-Standard-A', label: 'Standard A (Female)' },
    { value: 'ar-XA-Standard-B', label: 'Standard B (Male)' }
  ]
} as const
