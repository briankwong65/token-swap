import React from "react";
import "./WalletConnection.scss";
import classNames from "classnames";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

const injected = new InjectedConnector({
  supportedChainIds: [1, 11155111], // Mainnet, Sepolia
});

interface WalletConnectionParams {
  className?: string;
}

const WalletConnection = ({ className }: WalletConnectionParams) => {
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

  const shortenHash = (hash: string, symbols = 4): string =>
    `${hash.slice(0, 2 + symbols)}...${hash.slice(-symbols)}`;

  return (
    <div className={classNames("WalletConnection", className)}>
      {isActive && account ? (
        <div className="WalletConnection__connected-container">
          <div>{shortenHash(account)}</div>
          <button
            onClick={disconnect}
            className="WalletConnection__disconnect-button"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button onClick={connect} className="WalletConnection__connect-button">
          <img
            src="/metamask.png"
            alt="MetaMask"
            className="WalletConnection__metamask-icon"
          />
          Connect to MetaMask
        </button>
      )}
    </div>
  );
};

export default WalletConnection;
