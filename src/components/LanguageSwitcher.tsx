"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLanguage } from "@/app/actions/setLanguage";
import type { Locale } from "@/lib/locales";
import { Globe2, ChevronDown } from "lucide-react";

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
    <div className="relative ml-4">
      <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
        <Globe2 className="h-4 w-4 text-gray-500" />
          </div>

          <select
            aria-label="Select language"
            className="appearance-none rounded-full border border-gray-200 bg-white/80 px-7 pr-8 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:border-gray-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
            value={current}
            onChange={handleChange}
            disabled={isPending}
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="zh">中文</option>
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
        <ChevronDown className="h-3 w-3 text-gray-500" />
      </div>
    </div>
  );
}
