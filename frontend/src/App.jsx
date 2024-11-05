import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import EventForm from './pages/EventListingForm.jsx'
import './App.scss'

function App() {
  const [count, setCount] = useState(0)

  return (
    <EventForm></EventForm>
  )
}

export default App
