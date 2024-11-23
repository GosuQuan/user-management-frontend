import React from 'react'
import ReactDOM from 'react-dom/client'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import App from './App.tsx'
import 'antd/dist/reset.css'
import './index.css'

const emotionCache = createCache({
  key: 'emotion-cache',
  prepend: true,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CacheProvider value={emotionCache}>
      <App />
    </CacheProvider>
  </React.StrictMode>,
)
