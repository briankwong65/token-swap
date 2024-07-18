import React, { useState, useEffect, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import {
  ERC20_ABI,
  ROUTER_ABI,
  UNISWAP_V2_ROUTER,
  USDC_ADDRESS,
  WETH_ADDRESS,
} from "../constants";
import "./SwapInterface.scss";

const SwapInterface: React.FC = () => {
  const { account, provider } = useWeb3React();
  const [inputAmount, setInputAmount] = useState<string>("");
  const [outputAmount, setOutputAmount] = useState<string>("");
  const [isEthToUsdc, setIsEthToUsdc] = useState<boolean>(true);

  const getEstimatedOutput = useCallback(async () => {
    if (!provider) return;
    if (parseFloat(inputAmount) <= 0 || !parseFloat(inputAmount)) {
      setOutputAmount("");
      return;
    }
    try {
      const router = new ethers.Contract(
        UNISWAP_V2_ROUTER,
        ROUTER_ABI,
        provider
      );
      const path = isEthToUsdc
        ? [WETH_ADDRESS, USDC_ADDRESS]
        : [USDC_ADDRESS, WETH_ADDRESS];
      const amountIn = ethers.utils.parseEther(inputAmount);
      const amounts = await router.getAmountsOut(amountIn, path);
      setOutputAmount(
        ethers.utils.formatUnits(amounts[1], isEthToUsdc ? 6 : 18)
      );
    } catch (error) {
      console.error("Error estimating output:", error);
    }
  }, [inputAmount, isEthToUsdc, provider]);

  useEffect(() => {
    if (inputAmount && provider) {
      getEstimatedOutput();
    }
  }, [getEstimatedOutput, inputAmount, isEthToUsdc, provider]);

  const handleSwap = async () => {
    if (!account || !provider) return;
    const signer = provider.getSigner();
    const router = new ethers.Contract(UNISWAP_V2_ROUTER, ROUTER_ABI, signer);
    const wethAddress = await router.WETH();
    const path = isEthToUsdc
      ? [wethAddress, USDC_ADDRESS]
      : [USDC_ADDRESS, wethAddress];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

    try {
      if (isEthToUsdc) {
        const tx = await router.swapExactETHForTokens(
          0, // We're not setting a minimum amount out for simplicity
          path,
          account,
          deadline,
          { value: ethers.utils.parseEther(inputAmount) }
        );
        await tx.wait();
      } else {
        const usdcContract = new ethers.Contract(
          USDC_ADDRESS,
          ERC20_ABI,
          signer
        );
        const allowance = await usdcContract.allowance(
          account,
          UNISWAP_V2_ROUTER
        );
        const amountIn = ethers.utils.parseUnits(inputAmount, 6);
        if (allowance.lt(amountIn)) {
          const approveTx = await usdcContract.approve(
            UNISWAP_V2_ROUTER,
            amountIn
          );
          await approveTx.wait();
        }
        const tx = await router.swapExactTokensForETH(
          amountIn,
          0, // We're not setting a minimum amount out for simplicity
          path,
          account,
          deadline
        );
        await tx.wait();
      }
      console.log("Swap successful!");
    } catch (error) {
      console.error("Swap failed:", error);
    }
  };

  return (
    <div>
      <select onChange={(e) => setIsEthToUsdc(e.target.value === "true")}>
        <option value="true">ETH to USDC</option>
        <option value="false">USDC to ETH</option>
      </select>
      <input
        type="number"
        value={inputAmount}
        onChange={(e) => setInputAmount(e.target.value)}
        placeholder={`${isEthToUsdc ? "ETH" : "USDC"} amount`}
      />
      <input
        type="number"
        value={outputAmount}
        readOnly
        placeholder={`${isEthToUsdc ? "USDC" : "ETH"} amount`}
      />
      <button onClick={handleSwap} disabled={!account}>
        Swap
      </button>
    </div>
  );
};

export default SwapInterface;
