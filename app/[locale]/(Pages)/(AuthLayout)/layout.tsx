import React from "react";

interface RootLayoutProps {
  children: React.ReactNode;
}

 async function AuthLayout({  children }: RootLayoutProps) {
  return (
  <div className="pt-10 lg:pt-0">
    {children}

    </div>);
}

export default AuthLayout;
