// "use client"
// import { useEffect, useState } from "react";
// import axios from "./axios";

// import Echo from "laravel-echo";

// import Pusher from "pusher-js";

// window.Pusher = Pusher;

// const useEcho = () => {
//   const [echoInstance, setEchoInstance] = useState(null);

//   useEffect(() => {
//     const echo = new Echo({
//       broadcaster: "reverb",
//       key: process.env.REVERB_APP_KEY,
//       // authEndpoint: '/api/broadcasting/auth',
//       authorizer: (channel) => {
//         return {
//           authorize: (socketId, callback) => {
//             axios
//               .post("/api/broadcasting/auth", {
//                 socket_id: socketId,
//                 channel_name: channel.name,
//               })
//               .then((response) => {
//                 callback(false, response.data);
//               })
//               .catch((error) => {
//                 callback(true, error);
//               });
//             console.log("socket_id:", socketId);
//             console.log("channel_name:", channel.name);
//           },
//         };
//       },
//       wsHost: process.env.REVERB_HOST,
//       wsPort: process.env.REVERB_PORT ?? 80,
//       wssPort: process.env.REVERB_PORT ?? 443,
//       forceTLS: (process.env.REVERB_SCHEME ?? "https") === "https",
//       enabledTransports: ["ws", "wss"],
//       encrypted: true,
//     });

//     setEchoInstance(echo);
//   }, []);

//   return echoInstance;
// };

// export default useEcho;

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
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || "",
      // authEndpoint: '/api/broadcasting/auth',
      authorizer: (channel:any) => {
        return {
          authorize: (socketId: string, callback: (error: boolean, data?: any) => void) => {
            axios
              .post("/api/broadcasting/auth", {
                socket_id: socketId,
                channel_name: channel.name,
              })
              .then((response) => {
                callback(false, response.data);
              })
              .catch((error) => {
                callback(true, error);
              });
            console.log("socket_id:", socketId);
            console.log("channel_name:", channel.name);
          },
        };
      },
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || "localhost",
      wsPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || "80", 10),
      wssPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || "443", 10),
      forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME || "https") === "https",
      enabledTransports: ["ws", "wss"],
      encrypted: true,
    });

    setEchoInstance(echo);

    // Cleanup to disconnect Echo on unmount
    return () => {
      echo.disconnect();
    };
  }, []);

  return echoInstance;
};

export default useEcho;
