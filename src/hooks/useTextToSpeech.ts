import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { TTSOptions, TTSState } from '../types'

export const useTextToSpeech = () => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null)

  const [state, setState] = useState<TTSState>({
    isPlaying: false,
    isPaused: false,
    currentText: '',
    voices: [],
    selectedVoice: selectedVoiceRef.current,
    rate: 1,
    pitch: 1,
    volume: 1,
    lang: 'en'
  })

  // Load available voices
  const loadVoices = useCallback(() => {
    const voices = speechSynthesis.getVoices()
    setState(prev => ({
      ...prev,
      voices,
      selectedVoice: voices.find(voice => voice.lang.startsWith('en')) || voices[0] || null
    }))
  }, [])

  // Initialize voices
  useEffect(() => {
    loadVoices()
    speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => speechSynthesis.removeEventListener('voiceschanged', loadVoices)
  }, [loadVoices])

  // Sync ref with state to prevent voice loss
  useEffect(() => {
    if (state.selectedVoice && state.selectedVoice !== selectedVoiceRef.current) {
      selectedVoiceRef.current = state.selectedVoice
    }
  }, [state.selectedVoice])

  // Speak text using browser TTS
  const speak = useCallback((text: string, options: TTSOptions = {}) => {
    if (!text.trim()) return

    // Stop any current speech and wait a moment
    speechSynthesis.cancel()
    
    // Wait for speech to fully stop before starting new speech
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text)
      
      // Set voice - prioritize options.voice, then state.selectedVoice
      const selectedVoice = options.voice || state.selectedVoice
      if (selectedVoice && selectedVoice.name) {
        utterance.voice = selectedVoice
        console.log('Using voice:', selectedVoice.name, 'for text:', text.substring(0, 50))
      } else {
        console.log('No voice selected, using default')
      }
      
      // Set properties
      utterance.rate = options.rate ?? state.rate
      utterance.pitch = options.pitch ?? state.pitch
      utterance.volume = options.volume ?? state.volume
      utterance.lang = options.lang ?? state.lang

      // Event handlers
      utterance.onstart = () => {
        setState(prev => ({
          ...prev,
          isPlaying: true,
          isPaused: false,
          currentText: text
          // Don't update selectedVoice here - it causes UI flickering
        }))
      }

      utterance.onend = () => {
        setState(prev => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          currentText: ''
        }))
      }

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error)
        setState(prev => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          currentText: ''
        }))
      }

      utteranceRef.current = utterance
      speechSynthesis.speak(utterance)
    }, 100) // Small delay to ensure previous speech is fully stopped
  }, [state.selectedVoice, state.rate, state.pitch, state.volume, state.lang])

  // Pause speech
  const pause = useCallback(() => {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause()
      setState(prev => ({ ...prev, isPaused: true }))
    }
  }, [])

  // Resume speech
  const resume = useCallback(() => {
    if (speechSynthesis.paused) {
      speechSynthesis.resume()
      setState(prev => ({ ...prev, isPaused: false }))
    }
  }, [])

  // Stop speech
  const stop = useCallback(() => {
    speechSynthesis.cancel()
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentText: ''
    }))
  }, [])

  // Update settings
  const updateSettings = useCallback((updates: Partial<TTSState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates }
      // Store selected voice in ref to prevent loss
      if (updates.selectedVoice !== undefined) {
        selectedVoiceRef.current = updates.selectedVoice
      }
      return newState
    })
    console.log('Voice settings updated:', updates)
  }, [])

  // Detect language and set appropriate voice (only if no voice is manually selected)
  const detectLanguage = useCallback((text: string) => {
    // Don't auto-detect if user has manually selected a voice recently
    // Allow auto-detection if the current voice doesn't match the text language
    const hasHindi = /[\u0900-\u097F]/.test(text)
    const hasEnglish = /[a-zA-Z]/.test(text)
    
    // Only auto-detect if no voice is manually selected
    if (state.selectedVoice) {
      console.log('Voice manually selected, skipping auto-detection:', state.selectedVoice.name)
      return
    }
    
    console.log('Auto-detecting voice for text language')
    
    // For mixed language text, try to find a multilingual voice first
    if (hasHindi && hasEnglish) {
      // Look for multilingual voices that can handle both languages
      const multilingualVoice = state.voices.find(voice => 
        voice.name.toLowerCase().includes('multilingual') ||
        voice.name.toLowerCase().includes('universal') ||
        voice.name.toLowerCase().includes('neural')
      )
      
      if (multilingualVoice) {
        updateSettings({ selectedVoice: multilingualVoice, lang: 'hi' })
        return
      }
      
      // Fallback to Hindi voice for mixed text
      const hindiVoice = state.voices.find(voice => voice.lang.startsWith('hi'))
      if (hindiVoice) {
        updateSettings({ selectedVoice: hindiVoice, lang: 'hi' })
      }
    } else if (hasHindi) {
      const hindiVoice = state.voices.find(voice => voice.lang.startsWith('hi'))
      if (hindiVoice) {
        updateSettings({ selectedVoice: hindiVoice, lang: 'hi' })
      }
    } else {
      const englishVoice = state.voices.find(voice => voice.lang.startsWith('en'))
      if (englishVoice) {
        updateSettings({ selectedVoice: englishVoice, lang: 'en' })
      }
    }
  }, [state.voices, state.selectedVoice, updateSettings])

  // Force enable auto-detection
  const enableAutoDetection = useCallback(() => {
    setState(prev => ({ ...prev, selectedVoice: null }))
    console.log('Auto-detection enabled')
  }, [])

  // Memoize the returned object to prevent unnecessary re-renders
  return useMemo(() => ({
    ...state,
    speak,
    pause,
    resume,
    stop,
    updateSettings,
    detectLanguage,
    loadVoices,
    enableAutoDetection
  }), [
    state,
    speak,
    pause,
    resume,
    stop,
    updateSettings,
    detectLanguage,
    loadVoices,
    enableAutoDetection
  ])
}
