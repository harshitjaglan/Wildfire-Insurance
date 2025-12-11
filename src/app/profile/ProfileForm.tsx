"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { t } from "../../i18n";

interface User {
     id: string;
     name: string | null;
     email: string;
     image: string | null;
}

export function ProfileForm({ user }: { user: User }) {
     const [name, setName] = useState(user.name || "");
     const [isDeleting, setIsDeleting] = useState(false);
     const [showSuccess, setShowSuccess] = useState(false);
     const router = useRouter();
     const { update: updateSession, data: session } = useSession();

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          try {
               const res = await fetch(`/api/user/${user.id}`, {
                    method: "PUT",
                    headers: {
                         "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name }),
               });

               if (!res.ok) throw new Error(t("profile.handlers.updatePfp1"));

               setShowSuccess(true);
               setTimeout(() => {
                    router.push("/dashboard");
               }, 3000);
          } catch (error) {
               console.error(t("profile.handlers.error"), error);
               alert(t("profile.handlers.updatePfp2"));
          }
     };

     const handleDelete = async () => {
          if (!confirm(t("profile.handlers.deleteCconfirm"))) {
               return;
          }

          try {
               const res = await fetch(`/api/user/${user.id}`, {
                    method: "DELETE",
               });

               if (!res.ok) throw new Error(t("profile.handlers.deleteFail1"));

               router.push("/");
          } catch (error) {
               console.error("Error:", error);
               alert(t("profile.handlers.deleteFail2"));
          }
     };

     return (
          <div className="max-w-2xl mx-auto py-8 px-4">
               <h1 className="text-2xl font-bold mb-8">
                    {t("profile.headers.settings")}
               </h1>

               {showSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
                         <div className="flex">
                              <div className="flex-shrink-0">
                                   <svg
                                        className="h-5 w-5 text-green-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path
                                             fillRule="evenodd"
                                             d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                             clipRule="evenodd"
                                        />
                                   </svg>
                              </div>
                              <div className="ml-3">
                                   <p className="whitespace-pre-line text-sm text-green-700">
                                        {t("profile.paragraphs.success")}
                                   </p>
                              </div>
                         </div>
                    </div>
               )}

               <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <div className="flex items-center space-x-4 mb-6">
                         {user.image && (
                              <Image
                                   src={user.image}
                                   alt="Profile"
                                   width={80}
                                   height={80}
                                   className="rounded-full"
                              />
                         )}
                         <div>
                              <p className="text-sm text-gray-500">
                                   {t("profile.headers.picture")}
                              </p>
                              <p className="text-sm text-gray-500">
                                   {t("profile.paragraphs.update")}
                              </p>
                         </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div>
                              <label
                                   htmlFor="name"
                                   className="block text-sm font-medium text-gray-700">
                                   {t("profile.form.display")}
                              </label>
                              <input
                                   type="text"
                                   id="name"
                                   value={name}
                                   onChange={(e) => setName(e.target.value)}
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                         </div>

                         <div>
                              <label className="block text-sm font-medium text-gray-700">
                                   {t("profile.form.email")}
                              </label>
                              <p className="mt-1 text-gray-500">{user.email}</p>
                         </div>

                         <button
                              type="submit"
                              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                              {t("profile.form.save")}
                         </button>
                    </form>
               </div>

               <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-red-600 mb-4">
                         {t("profile.headers.danger")}
                    </h2>
                    <p className="text-gray-500 mb-4">
                         {t("profile.paragraphs.delete")}
                    </p>
                    <button
                         onClick={handleDelete}
                         className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                         {t("profile.buttons.delete")}
                    </button>
               </div>
          </div>
     );
}
