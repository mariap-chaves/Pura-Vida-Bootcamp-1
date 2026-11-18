import React from 'react'
import { useWallet } from '../context/WalletContext'
import { accountExists, getAccountInfo, getFriendBotUrl } from '../services/stellar'

export const WalletConnect: React.FC = () => {
  const { publicKey, connected, connect, disconnect, error, loading } = useWallet()
  const [accountExists_, setAccountExists] = React.useState<boolean | null>(null)
  const [accountInfo, setAccountInfo] = React.useState<any>(null)
  const [checking, setChecking] = React.useState(false)

  const truncateKey = (key: string) => `${key.slice(0, 10)}...${key.slice(-10)}`

  React.useEffect(() => {
    if (connected && publicKey) {
      checkAccount()
    }
  }, [connected, publicKey])

  const checkAccount = async () => {
    setChecking(true)
    try {
      const exists = await accountExists(publicKey!)
      setAccountExists(exists)

      if (exists) {
        const info = await getAccountInfo(publicKey!)
        setAccountInfo(info)
      }
    } catch (err) {
      console.error('Error verificando cuenta:', err)
    } finally {
      setChecking(false)
    }
  }

  if (error && !connected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4 text-red-400">❌ Error</h2>
          <p className="mb-6 text-white/80">{error}</p>
          <button onClick={connect} className="btn-primary w-full">
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md w-full">
          <h1 className="mb-2 text-center">🌟 Stellar Varial</h1>
          <p className="text-center text-white/70 mb-8">Conecta tu wallet con Testnet</p>

          <button
            onClick={connect}
            disabled={loading}
            className="btn-primary w-full mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Conectando...' : '🔗 Conectar Wallet'}
          </button>

          <div className="bg-blue-900/30 p-4 rounded-lg">
            <p className="text-sm text-white/70">
              💡 Necesitas instalar{' '}
              <a
                href="https://varialwallet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stellar-accent hover:underline"
              >
                Varial Wallet
              </a>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🌟 Stellar Testnet</h1>
          <p className="text-white/70">Conectado con Varial Wallet</p>
        </div>

        {/* Wallet Info Card */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Billetera Conectada</h2>
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              ✅ Testnet
            </span>
          </div>

          <div className="bg-black/20 p-4 rounded-lg mb-4">
            <p className="text-xs text-white/50 mb-1">Clave Pública</p>
            <p className="font-mono text-lg break-all">{publicKey}</p>
          </div>

          <button
            onClick={disconnect}
            className="btn-secondary w-full"
          >
            🔓 Desconectar
          </button>
        </div>

        {/* Account Status */}
        {checking ? (
          <div className="card mb-6">
            <p className="text-center">⏳ Verificando cuenta...</p>
          </div>
        ) : accountExists_ !== null ? (
          <div className="card mb-6">
            {accountExists_ ? (
              <div>
                <h3 className="text-lg font-bold mb-4 text-green-400">✅ Cuenta Activa en Testnet</h3>

                {accountInfo && (
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-white/70">Secuencia</p>
                      <p className="font-mono">{accountInfo.sequence}</p>
                    </div>

                    <div>
                      <p className="text-white/70 mb-2">Saldos</p>
                      <div className="space-y-1">
                        {accountInfo.balances.map((balance: any, idx: number) => (
                          <div key={idx} className="bg-black/20 p-2 rounded">
                            <p className="font-mono">
                              {balance.balance} {balance.asset_code || 'XLM'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold mb-4 text-yellow-400">⚠️ Cuenta No Existe</h3>
                <p className="text-white/70 mb-4">
                  Tu cuenta necesita ser financiada en Testnet para activarla.
                </p>

                <a
                  href={getFriendBotUrl(publicKey!)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary block text-center mb-3"
                >
                  💸 Financiar con FriendBot
                </a>

                <p className="text-xs text-white/50 text-center">
                  O usa{' '}
                  <a
                    href="https://laboratory.stellar.org/#friendbot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stellar-accent hover:underline"
                  >
                    Stellar Lab
                  </a>
                </p>
              </div>
            )}
          </div>
        ) : null}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <h3 className="font-bold mb-2">🔗 Testnet</h3>
            <p className="text-sm text-white/70">Red de pruebas para desarrollo y testing</p>
          </div>

          <div className="card">
            <h3 className="font-bold mb-2">🔐 Varial Wallet</h3>
            <p className="text-sm text-white/70">Cartera segura para firmar transacciones</p>
          </div>
        </div>
      </div>
    </div>
  )
}
