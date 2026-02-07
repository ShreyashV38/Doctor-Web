import "./globals.css";
import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen flex text-slate-900">
        <Sidebar />
        
        {/* Main Content Wrapper */}
        <main className="flex-1 md:ml-64 transition-all duration-300">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}