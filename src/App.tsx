import React from "react";
import "./App.scss";
import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { CONNECTORS } from "./wallet/connections";
import Header from "./components/Header";
import SwapInterface from "./components/SwapInterface";

const connectors: [Connector, Web3ReactHooks][] = Object.values(CONNECTORS).map(
  (connector) => [connector.connector, connector.hooks]
);

const App = () => {
  return (
    <Web3ReactProvider connectors={connectors}>
      <div className="App">
        <Header />
        <SwapInterface />
      </div>
    </Web3ReactProvider>
  );
};

export default App;
