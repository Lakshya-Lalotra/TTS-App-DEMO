import { GoogleTTSOptions, GoogleTTSResponse } from '../types/googleTTS'

export class GoogleTTSService {
  private apiKey: string
  private baseUrl = 'https://texttospeech.googleapis.com/v1/text:synthesize'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async synthesize(options: Omit<GoogleTTSOptions, 'apiKey'>): Promise<AudioBuffer> {
    const requestBody = {
      input: { text: options.text },
      voice: {
        languageCode: options.language || 'en-US',
        name: options.voice || 'en-US-Wavenet-D',
        ssmlGender: 'NEUTRAL'
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: options.speed || 1.0,
        pitch: options.pitch || 0.0,
        volumeGainDb: 0.0
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`Google TTS API error: ${response.status} ${response.statusText}`)
      }

      const data: GoogleTTSResponse = await response.json()
      
      // Convert base64 to AudioBuffer
      const audioData = atob(data.audioContent)
      const audioBuffer = new Uint8Array(audioData.length)
      for (let i = 0; i < audioData.length; i++) {
        audioBuffer[i] = audioData.charCodeAt(i)
      }

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      return await audioContext.decodeAudioData(audioBuffer.buffer)
    } catch (error) {
      console.error('Google TTS synthesis error:', error)
      throw error
    }
  }

  async playAudio(audioBuffer: AudioBuffer): Promise<void> {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const source = audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioContext.destination)
    source.start()
  }
}

// Re-export GOOGLE_VOICES for use in hooks
export { GOOGLE_VOICES } from '../types/googleTTS'

// Utility function to detect language from text
export const detectLanguage = (text: string): string => {
  const hasHindi = /[\u0900-\u097F]/.test(text)
  const hasEnglish = /[a-zA-Z]/.test(text)
  
  if (hasHindi && hasEnglish) {
    return 'hi-IN' // Mixed language, prefer Hindi
  } else if (hasHindi) {
    return 'hi-IN'
  } else {
    return 'en-US'
  }
}

