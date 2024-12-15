import React ,{ReactNode } from "react";

interface RootLayoutProps {
  params: {
    locale: string;
  };
  children: ReactNode;
}

export default async function AuthLayout({ params: { locale }, children }: RootLayoutProps) {
  return <div className="pt-10 lg:pt-0">{children}</div>;
}
 