import { useState } from 'react'
import './App.css'
import StartPage  from './components/StartPage'
import QuestionPage from './components/QuestionPage'

function App() {
  const [appState, setAppState] = useState(1)
  function startQuiz(){
    setAppState(2)
  }
  return (
    <>
      {appState===1? <StartPage  startQuiz={startQuiz} />: null}
      {appState===2? <QuestionPage /> : null}
    </>
  )
}

export default App
