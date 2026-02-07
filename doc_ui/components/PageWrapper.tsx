"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/onboarding";

  return (

    <main className={`transition-all duration-300 ${isAuthPage ? "w-full min-h-screen" : "flex-1 md:ml-64"}`}>
      <div className={`${isAuthPage ? "w-full h-full" : "max-w-7xl mx-auto p-4 md:p-8"}`}>
        {children}
      </div>
    </main>
  );
}