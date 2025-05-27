import { useState } from 'react'
import RouterConfig from './routes'
import { Toaster } from 'sonner';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <RouterConfig />
      <Toaster position="top-right" richColors />
    </div>
  )
}

export default App
