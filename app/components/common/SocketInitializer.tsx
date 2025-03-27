"use client";

import { useEffect, useRef } from "react";
import { useSocketStore } from "@/store/socketStore";

export default function SocketInitializer() {
  const initializeSocket = useSocketStore((state) => state.initializeSocket);
  const initialized = useRef(false); // Prevent multiple initializations

  useEffect(() => {
    if (!initialized.current) {
      initializeSocket();
      initialized.current = true;
    }
  }, [initializeSocket]);

  return null;
}
