import React from "react";
import { Navigation } from "@/components/Navigation";
import Providers from "./providers";
import { SignInButton } from "@/components/ui/SignInButton";
import "./globals.css";
import { Footer } from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="inter.className flex flex-col min-h-screen">
        <Providers>
          <Navigation />
          <main className="flex-grow">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
