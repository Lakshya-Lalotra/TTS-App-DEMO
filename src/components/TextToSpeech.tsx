import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, Square, Settings, Volume2, Globe } from 'lucide-react'
import { useTextToSpeech } from '../hooks/useTextToSpeech'
import Button from './ui/Button'
import Input from './ui/Input'
import TextArea from './ui/TextArea'
import Select from './ui/Select'
import Slider from './ui/Slider'
import './TextToSpeech.css'

const TextToSpeech: React.FC = () => {
  const [text, setText] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [voiceSearch, setVoiceSearch] = useState('')
  const [localSelectedVoice, setLocalSelectedVoice] = useState<string>('')
  const [isVoiceChanging, setIsVoiceChanging] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  
  // Persist voice selection across re-renders
  const persistentVoiceRef = useRef<SpeechSynthesisVoice | null>(null)

  const browserTTS = useTextToSpeech()

  // Store voice selection when it changes
  useEffect(() => {
    if (browserTTS.selectedVoice) {
      persistentVoiceRef.current = browserTTS.selectedVoice
      setLocalSelectedVoice(browserTTS.selectedVoice.name)
    }
  }, [browserTTS.selectedVoice])

  const currentTTS = browserTTS

  const handleSpeak = () => {
    if (!text.trim()) return
    
    // Show disclaimer if no voice is selected
    if (!browserTTS.selectedVoice) {
      setShowDisclaimer(true)
      return
    }
    
    // Force refresh voices before speaking
    browserTTS.loadVoices()
    browserTTS.detectLanguage(text)
    browserTTS.speak(text)
  }

  const handleSpeakWithDisclaimer = () => {
    setShowDisclaimer(false)
    // Force refresh voices before speaking
    browserTTS.loadVoices()
    browserTTS.detectLanguage(text)
    browserTTS.speak(text)
  }

  const handlePause = () => {
    if (currentTTS.isPaused) {
      currentTTS.resume()
    } else {
      currentTTS.pause()
    }
  }

  const handleStop = () => {
    currentTTS.stop()
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }



  const handleVoiceSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoiceSearch(e.target.value)
  }

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const voiceName = e.target.value
    setIsVoiceChanging(true)
    setLocalSelectedVoice(voiceName) // Update local state immediately
    const voice = browserTTS.voices.find(v => v.name === voiceName)
    browserTTS.updateSettings({ selectedVoice: voice || null })
    
    // Reset the changing flag after a short delay
    setTimeout(() => {
      setIsVoiceChanging(false)
    }, 100)
  }

  // Sync local state with browserTTS state
  useEffect(() => {
    if (!isVoiceChanging && browserTTS.selectedVoice?.name !== localSelectedVoice) {
      setLocalSelectedVoice(browserTTS.selectedVoice?.name || '')
    }
  }, [browserTTS.selectedVoice?.name, localSelectedVoice, isVoiceChanging])

  const getFilteredVoices = () => {
    if (!voiceSearch.trim()) return browserTTS.voices
    
    return browserTTS.voices.filter(voice => 
      voice.name.toLowerCase().includes(voiceSearch.toLowerCase()) ||
      voice.lang.toLowerCase().includes(voiceSearch.toLowerCase())
    )
  }

  const insertExample = (exampleText: string) => {
    setText(exampleText)
  }

  // Multilingual examples
  const examples = [
    {
      title: "5-6 Languages Mix",
      text: "Hello नमस्ते Hola مرحبا 你好 こんにちは 안녕하세요",
      description: "Greetings in English, Hindi, Spanish, Arabic, Chinese, Japanese, Korean"
    },
    {
      title: "Hinglish (Hindi + English)",
      text: "Kal main office ja raha tha, but traffic itna zyada tha ki meeting miss ho gayi.",
      description: "Mixed Hindi and English conversation"
    },
    {
      title: "3 Languages",
      text: "Bonjour Hello नमस्ते, comment allez-vous? How are you? आप कैसे हैं?",
      description: "French, English, and Hindi mix"
    }
  ]

  const isPlaying = currentTTS.isPlaying
  const isPaused = currentTTS.isPaused
  const isLoading = false

  return (
    <div className="tts-container">
      <div className="tts-header">
        <h2>Text to Speech Converter</h2>
        {browserTTS.selectedVoice && (
          <div className="current-voice-display">
            <span className="voice-label">Current Voice:</span>
            <span className="voice-name">{browserTTS.selectedVoice.name}</span>
            <Button 
              onClick={() => setShowSettings(true)}
              variant="secondary"
              size="small"
            >
              Change
            </Button>
          </div>
        )}
      </div>


      <div className="text-input-section">
        <TextArea
          value={text}
          onChange={handleTextChange}
          placeholder="Enter your text here... (Supports multilingual text like Hindi + English)"
          rows={6}
        />
        <div className="text-stats">
          <span>{text.length} characters</span>
          <span>{text.split(/\s+/).filter(word => word.length > 0).length} words</span>
        </div>
        
        {/* Multilingual Examples */}
        <div className="examples-section">
          <h3>Multilingual Examples</h3>
          <div className="examples-grid">
            {examples.map((example, index) => (
              <div key={index} className="example-card">
                <h4>{example.title}</h4>
                <p className="example-description">{example.description}</p>
                <div className="example-text" onClick={() => insertExample(example.text)}>
                  {example.text}
                </div>
                <Button 
                  onClick={() => insertExample(example.text)}
                  variant="secondary"
                  size="small"
                  icon={<Globe size={16} />}
                >
                  Use This Example
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="controls-section">
        <div className="main-controls">
          <Button
            onClick={handleSpeak}
            disabled={!text.trim() || isLoading}
            variant="primary"
            loading={isLoading}
            icon={!isLoading ? <Play size={24} /> : undefined}
          >
            {isLoading ? 'Synthesizing...' : 'Speak'}
          </Button>

          {isPlaying && (
            <>
              <Button
                onClick={handlePause}
                variant="secondary"
                icon={isPaused ? <Play size={24} /> : <Pause size={24} />}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </Button>

              <Button
                onClick={handleStop}
                variant="secondary"
                icon={<Square size={24} />}
              >
                Stop
              </Button>
            </>
          )}
        </div>

        <Button
          onClick={() => setShowSettings(!showSettings)}
          variant="secondary"
          icon={<Settings size={20} />}
        >
          Settings
        </Button>
      </div>

      {showSettings && (
        <div className="settings-panel">
          <h3>Voice Settings</h3>
          
          <>
              <div className="voice-search">
                <Input
                  label="Search Voices"
                  value={voiceSearch}
                  onChange={handleVoiceSearchChange}
                  placeholder="Search by name or language (e.g., 'natural', 'microsoft', 'india', 'en')"
                />
              </div>
              
              <Select
                label="Select Voice"
                value={localSelectedVoice}
                onChange={handleVoiceChange}
                options={getFilteredVoices().map((voice) => ({
                  value: voice.name,
                  label: `${voice.name} (${voice.lang})`
                }))}
              />
              
              
              {browserTTS.selectedVoice && (
                <div className="current-voice-info">
                  <strong>Current Voice:</strong> {browserTTS.selectedVoice.name} ({browserTTS.selectedVoice.lang})
                  <Button 
                    onClick={() => browserTTS.enableAutoDetection()}
                    variant="secondary"
                    size="small"
                    className="reset-voice-btn"
                  >
                    Reset to Auto-Detect
                  </Button>
                </div>
              )}
          </>


          <Slider
            label="Speed"
            value={browserTTS.rate}
            onChange={(value) => browserTTS.updateSettings({ rate: value })}
            min={0.5}
            max={2}
            step={0.1}
          />

          <Slider
            label="Pitch"
            value={browserTTS.pitch}
            onChange={(value) => browserTTS.updateSettings({ pitch: value })}
            min={-2}
            max={2}
            step={0.1}
          />

          <Slider
            label="Volume"
            value={browserTTS.volume}
            onChange={(value) => browserTTS.updateSettings({ volume: value })}
            min={0}
            max={1}
            step={0.1}
          />
        </div>
      )}

      {isPlaying && (
        <div className="status-indicator">
          <Volume2 size={16} />
          <span>Speaking: {currentTTS.currentText.substring(0, 50)}...</span>
        </div>
      )}

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="disclaimer-modal">
          <div className="disclaimer-content">
            <h3>⚠️ Voice Selection Required</h3>
            <p>
              No voice is currently selected. The system will automatically detect the best voice for your text, 
              or you can manually select a voice from the settings.
            </p>
            <div className="disclaimer-actions">
              <Button 
                onClick={handleSpeakWithDisclaimer}
                variant="primary"
              >
                Continue with Auto-Detection
              </Button>
              <Button 
                onClick={() => {
                  setShowDisclaimer(false)
                  setShowSettings(true)
                }}
                variant="secondary"
              >
                Select Voice Manually
              </Button>
              <Button 
                onClick={() => setShowDisclaimer(false)}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TextToSpeech
