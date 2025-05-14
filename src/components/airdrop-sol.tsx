import { useState } from 'react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { toast } from 'sonner'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'

const AirdropSol = () => {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [amount, setAmount] = useState("1")
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const airdropSol = async () => {
    if (!publicKey) return new WalletNotConnectedError()

    try {
      setIsLoading(true)

      // Request airdrop of selected amount in SOL
      const lamports = parseInt(amount) * LAMPORTS_PER_SOL
      const signature = await connection.requestAirdrop(publicKey, lamports)

      // Wait for confirmation
      await connection.confirmTransaction(signature)

      // Show success message
      toast.success(`Successfully airdropped ${amount} SOL to your wallet!`)
      setOpen(false)
    } catch (error: any) {
      console.error('Failed to airdrop SOL:', error)

      // Extract the meaningful part of the error message
      let errorMessage = 'Failed to airdrop SOL'

      // Handle the specific error format from Solana API
      if (error?.message) {
        try {
          // Check if this is a JSON RPC error
          if (error.message.includes('429')) {
            errorMessage = 'Airdrop limit reached or faucet has run dry. Try again later or visit faucet.solana.com'
          } else if (error.message.includes('JSON')) {
            // Try to parse the JSON part of the error
            const match = error.message.match(/{.*}/s)
            if (match) {
              const jsonData = JSON.parse(match[0])
              if (jsonData.error && jsonData.error.message) {
                errorMessage = jsonData.error.message
              }
            }
          } else {
            // Just use the error message directly
            errorMessage = error.message
          }
        } catch (parseError) {
          // If parsing fails, use the original message
          errorMessage = `${errorMessage}: ${error.message}`
        }
      }

      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-600/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Airdrop SOL
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Airdrop SOL</DialogTitle>
          <DialogDescription className="text-gray-400">
            Request an airdrop of SOL to your wallet (works only on devnet and testnet).
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="amount-select" className="text-sm text-gray-400">
              Amount to Airdrop
            </label>
            <Select
              value={amount}
              onValueChange={setAmount}
              disabled={isLoading}
            >
              <SelectTrigger className="bg-gray-700/50 border-gray-600 focus:ring-indigo-500 focus:border-indigo-500">
                <SelectValue placeholder="Select amount" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {[1, 2, 3, 4, 5].map((value) => (
                  <SelectItem key={value} value={value.toString()} className="text-white hover:bg-gray-600">
                    {value} SOL
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <p className="text-xs text-gray-500 mb-2 md:mb-0">
            Note: Airdrops are limited by network policies.
          </p>
          <Button
            onClick={airdropSol}
            disabled={isLoading}
            className={`${isLoading
              ? 'bg-indigo-600/50 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              `Airdrop ${amount} SOL`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AirdropSol
