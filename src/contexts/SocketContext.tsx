import React, { createContext, useEffect } from "react";
import { WS_SERVER } from "../configs/ServerConfig";
import SocketIoClient from "socket.io-client";
import IProps from "../types/IProps.types";

export const SocketContext = createContext<any>(null);

const socket = SocketIoClient(WS_SERVER);

export const SocketProvider: React.FC<IProps> = ({ children }) => {
  useEffect(() => {}, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
