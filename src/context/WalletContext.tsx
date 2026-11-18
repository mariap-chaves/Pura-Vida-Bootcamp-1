import React, { ReactNode } from 'react'

interface WalletContextType {
  publicKey: string | null
  connected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  error: string | null
  loading: boolean
}

const WalletContext = React.createContext<WalletContextType | undefined>(undefined)

export const useWallet = () => {
  const context = React.useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet debe usarse dentro de WalletProvider')
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [publicKey, setPublicKey] = React.useState<string | null>(null)
  const [connected, setConnected] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        if (!window.stellar) {
          return
        }

        const pubKey = await window.stellar.getPublicKey()
        if (pubKey) {
          setPublicKey(pubKey)
          setConnected(true)
        }
      } catch (err) {
        console.log('No hay conexión previa')
      }
    }

    checkConnection()
  }, [])

  const connect = async () => {
    try {
      setError(null)
      setLoading(true)

      if (!window.stellar) {
        throw new Error(
          'Varial Wallet no está instalada. Instálala desde https://varialwallet.com'
        )
      }

      const pubKey = await window.stellar.getPublicKey()

      if (!pubKey) {
        throw new Error('No se pudo obtener la clave pública')
      }

      setPublicKey(pubKey)
      setConnected(true)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al conectar'
      setError(errorMessage)
      setConnected(false)
      setPublicKey(null)
    } finally {
      setLoading(false)
    }
  }

  const disconnect = () => {
    setPublicKey(null)
    setConnected(false)
    setError(null)
  }

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        connected,
        connect,
        disconnect,
        error,
        loading
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
