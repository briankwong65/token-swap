import React from "react";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

const injected = new InjectedConnector({
  supportedChainIds: [1, 11155111], // Mainnet, Sepolia
});

const WalletConnection: React.FC = () => {
  const { account, isActive, connector } = useWeb3React();

  const connect = async () => {
    try {
      await connector?.activate(injected);
    } catch (ex) {
      console.log(ex);
    }
  };

  const disconnect = async () => {
    try {
      if (connector?.deactivate) {
        await connector.deactivate();
      } else {
        await connector.resetState();
      }
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div>
      {isActive ? (
        <div>
          <span>Connected with {account}</span>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connect}>Connect to MetaMask</button>
      )}
    </div>
  );
};

export default WalletConnection;
