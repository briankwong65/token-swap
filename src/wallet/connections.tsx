import { Web3ReactHooks } from "@web3-react/core";
import { AddEthereumChainParameter, Connector } from "@web3-react/types";
import { buildInjectedConnector } from "./injected";
import config from "../config";

export interface Connection {
  connector: Connector;
  hooks: Web3ReactHooks;
  type: ConnectionType;
}

export enum ConnectionType {
  INJECTED = "INJECTED",
}

export function onConnectionError(error: Error): void {
  console.debug(`web3-react error: ${error}`);
}

export const CONNECTORS: { [key in ConnectionType]: Connection } = {
  [ConnectionType.INJECTED]: buildInjectedConnector(),
};

export const switchNetwork = async (
  chainId: number,
  connectionType: ConnectionType | null
): Promise<void> => {
  if (connectionType) {
    const { connector } = CONNECTORS[connectionType];

    const addChainParameter: AddEthereumChainParameter = {
      chainId,
      chainName: config.chainLabel,
      rpcUrls: [config.rpcEndpoint],
      nativeCurrency: config.chainNativeCurrency,
      blockExplorerUrls: [config.chainExplorer],
    };
    await connector.activate(addChainParameter);
  }
};
