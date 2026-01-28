"use client";

import { io, Socket } from "socket.io-client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { NEXT_PUBLIC_SOCKET_URL } from "@/utils/constraints";

interface SocketContextType {
  socket: Socket | null;
  connect: (token: string) => void;
  disconnect: () => void;
  emit: (event: string, payload?: any) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [, forceUpdate] = useState({});

  const connect = (token: string) => {
    if (socketRef.current?.connected) return;

    const socket = io(NEXT_PUBLIC_SOCKET_URL, {
      transports: ["websocket"],
      auth: { token },
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("Socket Connected: ", socket.id);
      forceUpdate({});
    });
    socket.on("disconnect", () => {
      console.log("Socket Disconnected!!!");
      forceUpdate({});
    });
    socketRef.current = socket;
  };

  const disconnect = () => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    forceUpdate({});
  };

  const emit = (event: string, payload?: any) => {
    socketRef.current?.emit(event, payload);
  };

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, connect, disconnect, emit }}
    >
      {children}
    </SocketContext.Provider>
  );
};
