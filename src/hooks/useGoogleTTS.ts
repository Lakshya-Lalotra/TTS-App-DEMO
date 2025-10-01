import { useState, useCallback, useRef } from 'react'
import { GoogleTTSService, detectLanguage, GOOGLE_VOICES } from '../services/googleTTS'
import { GoogleTTSState } from '../types/googleTTS'

export const useGoogleTTS = () => {
  const [state, setState] = useState<GoogleTTSState>({
    isPlaying: false,
    isPaused: false,
    currentText: '',
    isLoading: false,
    error: null,
    apiKey: '',
    selectedLanguage: 'en-US',
    selectedVoice: 'en-US-Wavenet-D',
    speed: 1.0,
    pitch: 0.0
  })

  const ttsServiceRef = useRef<GoogleTTSService | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null)

  // Initialize Google TTS service
  const initializeService = useCallback((apiKey: string) => {
    if (!apiKey.trim()) {
      setState(prev => ({ ...prev, error: 'API key is required' }))
      return false
    }

    try {
      ttsServiceRef.current = new GoogleTTSService(apiKey)
      setState(prev => ({ ...prev, apiKey, error: null }))
      return true
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: `Failed to initialize Google TTS: ${error}` 
      }))
      return false
    }
  }, [])

  // Speak text using Google TTS
  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return

    if (!ttsServiceRef.current) {
      setState(prev => ({ ...prev, error: 'Google TTS service not initialized' }))
      return
    }

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null, 
      currentText: text 
    }))

    try {
      // Detect language and update settings
      const detectedLang = detectLanguage(text)
      const availableVoices = GOOGLE_VOICES[detectedLang as keyof typeof GOOGLE_VOICES] || GOOGLE_VOICES['en-US']
      const selectedVoice = availableVoices[0].value

      setState(prev => ({
        ...prev,
        selectedLanguage: detectedLang,
        selectedVoice
      }))

      // Synthesize audio
      const audioBuffer = await ttsServiceRef.current.synthesize({
        text,
        language: state.selectedLanguage,
        voice: state.selectedVoice,
        speed: state.speed,
        pitch: state.pitch
      })

      // Play audio
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      sourceNodeRef.current = audioContextRef.current.createBufferSource()
      sourceNodeRef.current.buffer = audioBuffer
      sourceNodeRef.current.connect(audioContextRef.current.destination)

      sourceNodeRef.current.onended = () => {
        setState(prev => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          currentText: ''
        }))
      }

      sourceNodeRef.current.start()
      setState(prev => ({ 
        ...prev, 
        isPlaying: true, 
        isPaused: false,
        isLoading: false 
      }))

    } catch (error) {
      console.error('Google TTS error:', error)
      setState(prev => ({ 
        ...prev, 
        error: `Speech synthesis failed: ${error}`,
        isLoading: false,
        isPlaying: false
      }))
    }
  }, [state.speed, state.pitch])

  // Pause speech
  const pause = useCallback(() => {
    if (audioContextRef.current && audioContextRef.current.state === 'running') {
      audioContextRef.current.suspend()
      setState(prev => ({ ...prev, isPaused: true }))
    }
  }, [])

  // Resume speech
  const resume = useCallback(() => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
      setState(prev => ({ ...prev, isPaused: false }))
    }
  }, [])

  // Stop speech
  const stop = useCallback(() => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop()
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentText: ''
    }))
  }, [])

  // Update settings
  const updateSettings = useCallback((updates: Partial<GoogleTTSState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    speak,
    pause,
    resume,
    stop,
    updateSettings,
    initializeService,
    clearError
  }
}
