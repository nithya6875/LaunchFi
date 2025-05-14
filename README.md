# Solana Token Launchpad

A powerful web application that enables users to launch their own tokens on the Solana blockchain with complete metadata support.

![Solana Token Launchpad](https://res.cloudinary.com/dwdbqwqxk/image/upload/v1742220433/Screenshot_2025-03-17_142015_wbvw1o.png)

[Live Link](https://solana-token-lauchpad.vercel.app/)

## Features

- **Multi-network Support**: Deploy tokens on any Solana network (Mainnet, Devnet, Testnet, Localhost)
- **Custom RPC Support**: Add your own RPC endpoints for specialized deployments
- **Token Metadata**: Create and attach comprehensive metadata to your token
- **Automatic Metadata Hosting**: Seamlessly upload and generate metadata URIs using Cloudinary
- **Authority Management**: Options to revoke mint and freeze authority as needed
- **Devnet SOL Airdrop**: Built-in functionality to request SOL airdrops on Devnet for testing
- **Modern UI**: Clean, responsive interface powered by Shadcn UI components and Tailwind CSS

## Tech Stack

- React with TypeScript
- Vite for fast development and optimized builds
- Tailwind CSS for styling
- Shadcn UI component library
- Solana Web3.js for blockchain interactions
- Solana SPL Token standard implementation
- Anza Wallet Adapter for seamless wallet connectivity

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm package manager
- A Solana wallet (like Phantom, Solflare, etc.)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Solana-Token-Lauchpad.git
   cd Solana-Token-Lauchpad
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a .env file based on the example:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   pnpm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Connect your wallet using the wallet adapter
2. Select the desired Solana network (Mainnet, Devnet, Testnet, etc.)
3. If using Devnet, you can airdrop SOL to your wallet for testing
4. Fill in the token creation form with:
   - Token name
   - Symbol
   - Initial supply
   - Decimals
   - Metadata image (uploaded to Cloudinary)
   - Additional metadata attributes
5. Choose authority settings (mint and freeze)
6. Launch your token!

## Development

### Project Structure

- components - React components including the token form and wallet adapter
- context - Context providers for network selection
- lib - Utility libraries
- utils - Helper functions

### Building for Production

```bash
pnpm run build
```

This generates a dist folder with optimized production files.

## Contributing

Contributions are always welcome! Don't think, just do it.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Solana Foundation for their excellent documentation
- The SPL Token program developers [Link](https://solana.com/fi/developers/guides/token-extensions/metadata-pointer)
- Contributors to the Anza Wallet Adapter [Link](https://github.com/anza-xyz/wallet-adapter)

---

Built with ❤️ for the Solana ecosystem

Similar code found with 2 license types
