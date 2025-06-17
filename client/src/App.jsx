import { useState, useEffect } from 'react'
import RouterConfig from './routes'
import { Toaster } from 'sonner';

function App() {
  const [count, setCount] = useState(0)

  // useEffect(() => {
  //   window.fbAsyncInit = function () {
  //     window.FB.init({
  //       appId: 2034555720282209, // <-- Thay bằng App ID của bạn
  //       cookie: true,
  //       xfbml: true,
  //       version: 'v19.0'
  //     });
  //   };
  // }, []);

  return (
    <div className="app">
      <RouterConfig />
      <Toaster position="top-right" richColors />
    </div>
  )
}

export default App
