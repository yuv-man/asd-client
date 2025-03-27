import { create } from "zustand";
import { io, Socket } from "socket.io-client";

interface SocketState {
  socket: Socket | null;
  initializeSocket: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  initializeSocket: () => {
    if (get().socket) return; // Prevent multiple connections

    const socketInstance = io("http://localhost:5000", {
      reconnection: true, // Ensure it tries to reconnect
      reconnectionAttempts: 5, // Limit reconnection attempts
      reconnectionDelay: 2000, // Delay between retries
    });

    set({ socket: socketInstance });

    socketInstance.on("connect", () => console.log("✅ Socket connected"));
    socketInstance.on("disconnect", () => console.log("❌ Socket disconnected"));

    // Optional: Handle auto-reconnect issues
    socketInstance.io.on("reconnect_attempt", () => {
      console.log("🔄 Attempting to reconnect...");
    });

    return () => {
      socketInstance.disconnect();
      set({ socket: null });
    };
  },
}));
