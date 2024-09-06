import React, { createContext, useEffect, useState, useMemo } from "react";
import { WS_SERVER } from "../configs/ServerConfig";
import SocketIoClient from "socket.io-client";
import IProps from "../types/IProps.types";
import { v4 as UUIDV4 } from "uuid";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SocketContext = createContext<any>(null);

const socket = SocketIoClient(WS_SERVER);

export const SocketProvider: React.FC<IProps> = ({ children }) => {
  const [userId, setUserId] = useState(UUIDV4());
  const [problemId, setProblemId] = useState("66ad1268f556d80850f96157");
  const [response, setResponse] = useState("");

  socket.on("connect", () => {
    console.log("Connected To The Server");
  });

  socket.on("submissionPayloadResponse", (data) => {
    console.log("Received Submission Response:-");
    console.log(data);
    let result;
    if (data.status == "Success") {
      result = data.stdout;
    } else {
      result = data.stderr;
    }
    setResponse(result);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected To The Server");
  });

  useEffect(() => {
    console.log("Sending User Id Mapping Request In Backend");
    socket.emit("setUserId", userId);
  }, [userId]);

  const value = useMemo(
    () => ({
      socket,
      userId,
      setUserId,
      problemId,
      setProblemId,
      response,
      setResponse,
    }),
    [userId, problemId, response]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
