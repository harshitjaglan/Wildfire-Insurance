"use server";

import { cookies } from "next/headers";
import type { Locale } from "@/i18n";

export async function setLanguage(lang: Locale) {
  cookies().set("lang", lang, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, 
  });
}
