import React, { useState, useEffect, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { ERC20_ABI, ROUTER_ABI } from "../constants";
import "./SwapInterface.scss";
import config from "../config";

const SwapInterface = () => {
  const { account, provider } = useWeb3React();
  const [inputAmount, setInputAmount] = useState<string>("");
  const [outputAmount, setOutputAmount] = useState<string>("");
  const [isEthToUsdc, setIsEthToUsdc] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const validateInputAmount = (amount: string): boolean => {
    const numAmount = parseFloat(amount);
    return !isNaN(numAmount) && numAmount > 0;
  };

  const isInputValid = validateInputAmount(inputAmount);

  const getEstimatedOutput = useCallback(async () => {
    if (!provider) return;
    if (!isInputValid) {
      setOutputAmount("");
      return;
    }
    try {
      const router = new ethers.Contract(
        config.UNISWAP_V2_ROUTER,
        ROUTER_ABI,
        provider
      );
      const path = isEthToUsdc
        ? [config.WETH_ADDRESS, config.USDC_ADDRESS]
        : [config.USDC_ADDRESS, config.WETH_ADDRESS];
      const amountIn = ethers.utils.parseEther(inputAmount);
      const amounts = await router.getAmountsOut(amountIn, path);
      setOutputAmount(
        ethers.utils.formatUnits(amounts[1], isEthToUsdc ? 6 : 18)
      );
    } catch (error) {
      console.error("Error estimating output:", error);
    }
  }, [inputAmount, isEthToUsdc, isInputValid, provider]);

  useEffect(() => {
    if (inputAmount !== undefined && provider) {
      getEstimatedOutput();
    }
  }, [getEstimatedOutput, inputAmount, isEthToUsdc, provider]);

  const handleSwap = async () => {
    if (!account || !provider) return;

    setError(null);
    setStatus("Initiating swap...");

    try {
      const signer = provider.getSigner();
      const router = new ethers.Contract(
        config.UNISWAP_V2_ROUTER,
        ROUTER_ABI,
        signer
      );
      const wethAddress = await router.WETH();
      const path = isEthToUsdc
        ? [wethAddress, config.USDC_ADDRESS]
        : [config.USDC_ADDRESS, wethAddress];
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

      if (isEthToUsdc) {
        setStatus("Swapping ETH for USDC...");
        const tx = await router.swapExactETHForTokens(
          0, // We're not setting a minimum amount out for simplicity
          path,
          account,
          deadline,
          { value: ethers.utils.parseEther(inputAmount) }
        );
        setStatus("Waiting for transaction confirmation...");
        await tx.wait();
      } else {
        setStatus("Approving USDC spend...");
        const usdcContract = new ethers.Contract(
          config.USDC_ADDRESS,
          ERC20_ABI,
          signer
        );
        const allowance = await usdcContract.allowance(
          account,
          config.UNISWAP_V2_ROUTER
        );
        const amountIn = ethers.utils.parseUnits(inputAmount, 6);
        if (allowance.lt(amountIn)) {
          const approveTx = await usdcContract.approve(
            config.UNISWAP_V2_ROUTER,
            amountIn
          );
          await approveTx.wait();
        }
        setStatus("Swapping USDC for ETH...");
        const tx = await router.swapExactTokensForETH(
          amountIn,
          0, // We're not setting a minimum amount out for simplicity
          path,
          account,
          deadline
        );
        setStatus("Waiting for transaction confirmation...");
        await tx.wait();
      }
      setStatus("Swap successful!");
    } catch (error) {
      console.error("Swap failed:", error);
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        if (
          error.message.includes("user rejected") ||
          error.message.includes("ACTION_REJECTED")
        ) {
          errorMessage = "Swap failed: Transaction rejected";
        } else if (error.message.includes("INSUFFICIENT_FUNDS")) {
          errorMessage = "Swap failed: Insufficient funds";
        } else if (error.message.includes("transaction failed")) {
          errorMessage = `Swap failed: Transaction failed`;
        } else {
          errorMessage = "Swap failed";
        }
      }

      setError(errorMessage);
      setStatus(null);
    }
  };

  return (
    <div className="SwapInterface">
      <select
        onChange={(e) => setIsEthToUsdc(e.target.value === "true")}
        className="SwapInterface__select"
      >
        <option value="true">ETH to USDC</option>
        <option value="false">USDC to ETH</option>
      </select>
      <input
        type="number"
        value={inputAmount}
        onChange={(e) => setInputAmount(e.target.value)}
        placeholder={`${isEthToUsdc ? "ETH" : "USDC"} amount`}
        className="SwapInterface__input"
      />
      <input
        type="number"
        value={outputAmount}
        readOnly
        placeholder={`${isEthToUsdc ? "USDC" : "ETH"} amount`}
        className="SwapInterface__output"
      />
      <button
        onClick={handleSwap}
        disabled={!account || !isInputValid}
        className="SwapInterface__button"
      >
        Swap
      </button>
      {status && <p className="SwapInterface__swap-status">{status}</p>}
      {error && <p className="SwapInterface__swap-error">{error}</p>}
    </div>
  );
};

export default SwapInterface;
