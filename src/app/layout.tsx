import React from "react";
import { Navigation } from "@/components/Navigation";
import Providers from "./providers";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { t, getCurrentLocale } from "@/i18n";
import type { Locale } from "@/lib/locales";

export default function RootLayout({children,}: {children: React.ReactNode;}) {
  const lang: Locale = getCurrentLocale();

  const navLabels = {
    home: t("navigation.link.home"),
    dashboard: t("navigation.link.dashboard"),
    room: t("navigation.link.room"),
    items: t("navigation.link.items"),
    signOut: t("navigation.buttons.signOut"),
  };

  return (
    <html lang={lang}>
      <body className="inter.className flex flex-col min-h-screen">
        <Providers>
          <Navigation lang={lang} labels={navLabels} />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
