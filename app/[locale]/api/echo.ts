"use client";
import { useEffect, useState } from "react";
import axios from "./axios";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}
window.Pusher = Pusher;
const useEcho = (): any => {
  const [echoInstance, setEchoInstance] = useState<any>(null);

  useEffect(() => {
    const echo = new Echo({
      broadcaster: "reverb",
      key: process.env.REVERB_APP_KEY,
      authorizer: (channel: any) => {
        return {
          authorize: (
            socketId: string,
            callback: (error: boolean, data?: any) => void
          ) => {
            axios
              .post("/broadcasting/auth", {
                socket_id: socketId,
                channel_name: channel.name,
              })
              .then((response) => {
                callback(false, response.data);
              })
              .catch((error) => {
                callback(true, error);
              });
          },
        };
      },
      wsHost: process.env.REVERB_HOST,
      wsPort: process.env.REVERB_PORT ?? 80,
      wssPort: process.env.REVERB_PORT ?? 443,
      forceTLS: (process.env.REVERB_SCHEME ?? "https") === "https",
      enabledTransports: ["ws", "wss"],
      encrypted: true,
    });

    setEchoInstance(echo);
  }, []);

  return echoInstance;
};

export default useEcho;
