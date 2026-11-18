/// <reference types="vite/client" />

interface Window {
  stellar?: {
    getPublicKey: () => Promise<string>
    signTransaction: (xdr: string) => Promise<string>
    signMessage: (message: string) => Promise<{ signature: string; publicKey: string }>
  }
}

export {}
