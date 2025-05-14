import TokenLauchpadForm from "./components/TokenLauchpadForm"
import WalletAdapter from "./components/WalletAdapter"
import { Github, Twitter } from "lucide-react"

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/70 flex flex-col">
      <header className="py-6 px-4 border-b border-border/40 shadow-sm backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Solana Token Launchpad
          </h1>
          <WalletAdapter />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          <TokenLauchpadForm />
        </div>
      </main>

      <footer className="py-4 border-t border-border/20 text-center text-xs text-muted-foreground">
        <div className="container mx-auto flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <a
              href="https://github.com/nithya6875"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-foreground transition-colors"
            >
              <Github size={16} className="mr-1" />
              <span>GitHub</span>
            </a>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-2">
            <span>Made by</span>
            <a
              href="https://x.com/tw_nithya"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-blue-400 transition-colors font-medium"
            >
              <Twitter size={15} className="mr-1 text-blue-400" />
              <span>@tw_nithya</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
