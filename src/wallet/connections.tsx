import { Web3ReactHooks } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { buildInjectedConnector } from "./injected";

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
