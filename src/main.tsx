// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WalletAdapterProvider } from './components/WalletAdapterProvider.tsx'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from './components/ui/sonner.tsx'
import { NetworkProvider } from './context/NetworkContext.tsx'

createRoot(document.getElementById('root')!).render(
  <NetworkProvider>
    <WalletAdapterProvider>
      <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
        <App />
        <Toaster />
      </ThemeProvider>
    </WalletAdapterProvider>
  </NetworkProvider>
)
