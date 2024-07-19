# Token Swap Application

This React application allows users to swap between ETH and USDC on the Ethereum Sepolia testnet / Ethereum mainnet using Uniswap V2 protocol.

## Features

- Connect to MetaMask wallet
- Swap ETH to USDC and USDC to ETH
- Real-time price updates
- Error handling and transaction status updates

## Prerequisites

- Node.js (v16 or later)
- yarn
- MetaMask browser extension

## Setup

1. Clone the repository:

### `git clone https://github.com/briankwong65/token-swap.git`

2. Install dependencies:

### `yarn`

3. Create a `.env` file in the root directory and copy content from

- `.env.local`(for testnet) (default)
- `.env.production`(for mainnet)

4. Start the development server:

### `yarn start`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Connect your MetaMask wallet to the Sepolia testnet.
2. Click "Connect to MetaMask" in the app.
3. Enter the amount of ETH or USDC you want to swap.
4. Click "Swap" and confirm the transaction in MetaMask.

## Configuration

The application uses the following Sepolia testnet addresses:

- Uniswap V2 Router: 0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008
- USDC: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
- WETH: 0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9

These can be modified in the `src/config.js` file if needed.

## Development

- The main swap logic is implemented in `src/components/SwapInterface.tsx`.
- Wallet connection is handled in `src/components/WalletConnection.tsx`.
- The application uses web3-react for Ethereum interactions.

## Deployment

To build the app for production:

### `yarn build`

This creates a `build` folder with the production-ready application.

## License

This project is licensed under the MIT License.

## Disclaimer

Use at your own risk on the Sepolia testnet. Do not use with real assets on mainnet without proper auditing and testing.
