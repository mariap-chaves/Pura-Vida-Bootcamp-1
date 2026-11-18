import React from 'react'
import { WalletProvider } from './context/WalletContext'
import { WalletConnect } from './components/WalletConnect'
import './index.css'

function App() {
  return (
    <WalletProvider>
      <WalletConnect />
    </WalletProvider>
  )
}

export default App
