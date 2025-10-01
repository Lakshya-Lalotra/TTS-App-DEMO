import TextToSpeech from './components/TextToSpeech'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Text to Speech</h1>
        <p>Convert your text to speech with multilingual support</p>
      </header>
      <main className="app-main">
        <TextToSpeech />
      </main>
    </div>
  )
}

export default App
