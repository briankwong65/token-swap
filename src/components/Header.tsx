import React from "react";
import "./Header.scss";
import WalletConnection from "../wallet/WalletConnection";

const Header = () => {
  return (
    <header className="Header">
      <h1 className="Header__title">Token Swap</h1>
      <WalletConnection className="Header__wallet" />
    </header>
  );
};

export default Header;
