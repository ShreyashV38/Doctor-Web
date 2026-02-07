import "./globals.css";
import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import PageWrapper from "@/components/PageWrapper";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen flex text-slate-900">
        <Sidebar />
        <PageWrapper>{children}</PageWrapper>
      </body>
    </html>
  );
}