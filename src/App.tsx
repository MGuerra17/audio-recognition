/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import './App.css'

declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
    SpeechGrammarList: any
    webkitSpeechGrammarList: any
    SpeechRecognitionEvent: any
    webkitSpeechRecognitionEvent: any
  }
}

function App() {
  const [recording, setRecording] = useState(false)
  const [outputText, setOutputText] = useState('')
  const [errorText, setErrorText] = useState('')
  const [statusText, setStatusText] = useState('')

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const grammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList

  const phrases = ['Raiz aortica', 'Tapse', 'Insuficiencia triscupidea', 'Nombre del paciente', 'Septum en diastole']
  const grammar = '#JSGF V1.0; grammar phrases; public <phrase> = ' + phrases.join(' | ') + ' ;'

  const speechRecognitionList = new grammarList()
  speechRecognitionList.addFromString(grammar, 1)

  if (SpeechRecognition) {
    console.log('Tu navegador soporta reconocimiento de voz')
  } else {
    console.log('Tu navegador no soporta reconocimiento de voz')
  }

  const recognition = new SpeechRecognition()

  recognition.grammars = speechRecognitionList
  recognition.continuous = true
  recognition.interimResults = true
  recognition.lang = 'es-ES'

  recognition.onresult = (event: any) => {
    console.log(event.results)
    const results = event.results
    const frase = results[results.length - 1][0].transcript
    setOutputText(frase)
  }

  recognition.onend = () => {
    console.log('El micrófono deja de escuchar')
  }

  recognition.onerror = (event: any) => {
    console.log(event.error)
    setErrorText('Error: ' + event.error)
  }

  const handleRecord = () => {
    if (!recording) {
      recognition.start()
      console.log('El micrófono está escuchando')
      setStatusText('Escuchando...')
    } else {
      recognition.stop()
      console.log('El micrófono deja de escuchar')
      setStatusText('Finalizado...')
    }
    setRecording(!recording)
  }

  return (
    <>
      <h1>Audio a Texto</h1>
      <button onClick={handleRecord}>{recording ? 'Detener' : 'Grabar'}</button>
      <p>Status</p>
      <p>{statusText}</p>
      <p>Texto de salida</p>
      <p>{outputText}</p>
      <p>Error</p>
      <p>{errorText}</p>
    </>
  )
}

export default App
