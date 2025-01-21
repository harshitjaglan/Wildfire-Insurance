import React from "react";
import { Navigation } from "@/components/Navigation";
import Providers from "./providers";
import { SignInButton } from "@/components/ui/SignInButton";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="inter.className">
        <Providers>
          <Navigation />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
