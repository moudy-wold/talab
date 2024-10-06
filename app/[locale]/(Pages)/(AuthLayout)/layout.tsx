import React from "react";

interface RootLayoutProps {
  params: {
    locale: string;
  };
  children: React.ReactNode;
}

 async function AuthLayout({ params: { locale }, children }: RootLayoutProps) {
  return (
  <div className="pt-10 lg:pt-0">
    {children}

    </div>);
}

export default AuthLayout;
