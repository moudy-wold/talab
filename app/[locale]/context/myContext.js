"use client";
import { createContext, useState } from "react";

export const MyContext = createContext();

export function MyProvider({ children }) {
  const [logined, setLogined] = useState(false);
  const [logOut, setLogOut] = useState(false);

  return (
    <MyContext.Provider
      value={{
        logined,
        setLogined,
        logOut,
        setLogOut,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}
