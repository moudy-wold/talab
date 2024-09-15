import React from "react";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="pt-10 lg:pt-0">{children}</div>;
}

export default AuthLayout;
