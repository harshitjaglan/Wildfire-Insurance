"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import type { Locale } from "@/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

type NavLabels = {
  home: string;
  dashboard: string;
  room: string;
  items: string;
  signOut: string;
};

export function Navigation({ lang, labels }: { lang: Locale; labels: NavLabels }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo/Home */}
            <Link
              href="/dashboard"
              className="flex items-center px-2 py-2 text-gray-900 hover:text-gray-600"
            >
              <span className="text-xl font-bold">
                {labels.home}
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/dashboard"
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {labels.dashboard}
              </Link>
              <Link
                href="/rooms"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/rooms"
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {labels.room}
              </Link>
              <Link
                href="/items"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/items"
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {labels.items}
              </Link>
            </div>
          </div>

          {/* User Menu + Language switcher */}
          <div className="flex items-center">
            <LanguageSwitcher current={lang} />
            {session?.user?.image && (
              <Image
                src={session.user.image}
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <button
              onClick={() => signOut()}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              {labels.signOut}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
