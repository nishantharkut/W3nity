// socket.ts
// @ts-ignore
// eslint-disable-next-line
import { io } from "socket.io-client";

// Add type for import.meta.env if missing
interface ImportMeta {
  env: {
    VITE_API_URL: string;
    [key: string]: string;
  };
}

declare global {
  interface ImportMeta {
    env: {
      VITE_API_URL: string;
      [key: string]: string;
    };
  }
}

export const socket = io(import.meta.env.VITE_API_URL);

export const registerUserForNotifications = (userId: string) => {
  if (userId) {
    socket.emit('registerUser', userId);
  }
}; 
