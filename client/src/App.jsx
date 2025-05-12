import { useState } from 'react'
import RouterConfig from './routes'
import Header from './components/BookingHeader'
import Footer from './components/BookingFooter'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <RouterConfig />
    </div>
  )
}

export default App
