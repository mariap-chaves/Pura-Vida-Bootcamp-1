import { Server, Keypair, TransactionBuilder, Networks, BASE_FEE, Operation } from '@stellar/stellar-sdk'

// Configuración de Testnet
export const TESTNET_CONFIG = {
  horizon: 'https://horizon-testnet.stellar.org',
  rpc: 'https://soroban-testnet.stellar.org',
  networkPassphrase: Networks.TESTNET_NETWORK_PASSPHRASE,
  friendbot: 'https://friendbot.stellar.org'
}

// Instancia singleton de Horizon
let horizonServer: Server | null = null

export const getHorizonServer = () => {
  if (!horizonServer) {
    horizonServer = new Server(TESTNET_CONFIG.horizon)
  }
  return horizonServer
}

// Verificar si una cuenta existe en Testnet
export const accountExists = async (publicKey: string): Promise<boolean> => {
  try {
    const server = getHorizonServer()
    await server.loadAccount(publicKey)
    return true
  } catch (err: any) {
    if (err.response?.status === 404) {
      return false
    }
    throw err
  }
}

// Obtener información de la cuenta
export const getAccountInfo = async (publicKey: string) => {
  const server = getHorizonServer()
  const account = await server.loadAccount(publicKey)

  return {
    id: account.id,
    sequence: account.sequence,
    balances: account.balances,
    signers: account.signers
  }
}

// Crear transacción de pago
export const createPaymentTransaction = async (
  sourcePublicKey: string,
  destinationPublicKey: string,
  amount: string,
  memo?: string
) => {
  const server = getHorizonServer()
  const account = await server.loadAccount(sourcePublicKey)

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: TESTNET_CONFIG.networkPassphrase
  })
    .addOperation(
      Operation.payment({
        destination: destinationPublicKey,
        asset: Operation.Deposit().asset || { code: 'XLM', issuer: '' },
        amount: amount
      })
    )
    .setTimeout(300)

  if (memo) {
    transaction.addMemo({ type: 'text', value: memo })
  }

  return transaction.build()
}

// URL de FriendBot para financiar cuenta
export const getFriendBotUrl = (publicKey: string): string => {
  return `${TESTNET_CONFIG.friendbot}?addr=${publicKey}`
}

// Enviar transacción a la red
export const submitTransaction = async (signedTransactionXDR: string) => {
  const server = getHorizonServer()
  const transaction = server.submitTransaction(signedTransactionXDR)
  return transaction
}
