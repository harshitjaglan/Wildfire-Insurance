"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { t } from "../../i18n";

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
                    <p>
                         {t("signInButton.paragraphs.welcome")}{" "}
                         {session.user.name}
                    </p>
                    <button
                         onClick={() => signOut()}
                         className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                         {t("signInButton.buttons.out")}
                    </button>
               </div>
          );
     }

     return (
          <button onClick={() => signIn()} className={className}>
               {t("signInButton.buttons.in")}
          </button>
     );
}
