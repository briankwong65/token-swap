export const UNISWAP_V2_ROUTER = "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008";
export const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // Sepolia USDC address

export const ROUTER_ABI = [
  "function WETH() external pure returns (address)",
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
];

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
];

export const WETH_ADDRESS = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";