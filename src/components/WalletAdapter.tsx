import {
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui'
import { ModeToggle } from './mode-toggle'
import { NetworkSelector } from './NetworkSelector'
import { useNetwork } from '@/context/NetworkContext'
import AirdropSol from './airdrop-sol'

const WalletAdapter = () => {
  const { network } = useNetwork()
  const isDevnet = network === 'devnet'

  return (
    <div className="flex items-center gap-4">
      {isDevnet && (<AirdropSol />)}
      <NetworkSelector />
      <div className="flex items-center space-x-2">
        <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 dark:!bg-blue-600 dark:hover:!bg-blue-700" />
        <WalletDisconnectButton className="!bg-secondary !text-secondary-foreground hover:!bg-secondary/90" />
      </div>
      <ModeToggle />
    </div>
  )
}

export default WalletAdapter
