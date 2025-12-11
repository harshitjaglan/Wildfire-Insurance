"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLanguage } from "@/app/actions/setLanguage";
import type { Locale } from "@/lib/locales"; // ⬅️ changed

export function LanguageSwitcher({ current }: { current: Locale }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const lang = e.target.value as Locale;
    startTransition(async () => {
      await setLanguage(lang);
      router.refresh();
    });
  }

  return (
    <select
      aria-label="Select language"
      className="ml-4 rounded-md border px-2 py-1 text-sm bg-white"
      value={current}
      onChange={handleChange}
      disabled={isPending}
    >
      <option value="en">EN</option>
      <option value="es">ES</option>
      <option value="zh">中文</option>
    </select>
  );
}
