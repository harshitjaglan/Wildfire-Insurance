"use client";

import { signIn, signOut, useSession } from "next-auth/react";

interface SignInButtonProps {
  className?: string;
}

export function SignInButton({
  className = "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded",
}: SignInButtonProps) {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="flex items-center gap-4">
        <p>Welcome, {session.user.name}</p>
        <button
          onClick={() => signOut()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => signIn()} className={className}>
      Sign In
    </button>
  );
}
