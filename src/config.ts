export const currentENV = (() => {
  switch (process.env.CONTEXT) {
    case 'production':
      return 'production';
    default:
      return 'local';
  }
})();

export interface ConfigEnvType {
  UNISWAP_V2_ROUTER: string;
  USDC_ADDRESS: string;
  WETH_ADDRESS: string;
  chainId: number;
}

export const configs: {
  local: ConfigEnvType;
  production: ConfigEnvType;
} = {
  local: {
    UNISWAP_V2_ROUTER: "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008",
    USDC_ADDRESS: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // Sepolia USDC address
    WETH_ADDRESS: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    chainId: 11155111,
  },
  production: {
    UNISWAP_V2_ROUTER: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    USDC_ADDRESS: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    WETH_ADDRESS: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    chainId: 1,
  }
}

export default configs[currentENV];
