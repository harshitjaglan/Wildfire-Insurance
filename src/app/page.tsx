import { getServerSession } from "next-auth";
import { OPTIONS } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/ui/SignInButton";
import Image from "next/image";
import { FaSortAmountDown, FaClipboardList, FaFilePdf } from "react-icons/fa";
import { t } from "../i18n";

export default async function HomePage() {
     const session = await getServerSession(OPTIONS);

     if (session?.user) {
          redirect("/dashboard");
     }

     return (
          <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 relative overflow-hidden">
               {/* Abstract background shapes */}
               <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-gradient-to-br from-pink-400 to-transparent rounded-full opacity-20 blur-3xl"></div>
                    <div className="absolute -right-1/4 -bottom-1/4 w-3/4 h-3/4 bg-gradient-to-tl from-yellow-300 to-transparent rounded-full opacity-20 blur-3xl"></div>
               </div>

               <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <header className="text-center mb-16">
                         <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
                              {t("app.headers.title")}
                         </h1>
                         <p className="text-xl text-white max-w-2xl mx-auto drop-shadow">
                              {t("app.paragraphs.description")}
                         </p>
                    </header>

                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                         <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-xl">
                              <h2 className="text-3xl font-bold text-white mb-6">
                                   {t("app.headers.streamline")}
                              </h2>
                              <ul className="space-y-4">
                                   <FeatureItem
                                        icon={
                                             <FaSortAmountDown className="text-yellow-300" />
                                        }
                                        title={t("app.title.organize")}
                                        description={t("app.description.sort")}
                                   />
                                   <FeatureItem
                                        icon={
                                             <FaClipboardList className="text-green-300" />
                                        }
                                        title={t("app.title.detail")}
                                        description={t("app.description.add")}
                                   />
                                   <FeatureItem
                                        icon={
                                             <FaFilePdf className="text-red-300" />
                                        }
                                        title={t("app.title.generate1")}
                                        description={t(
                                             "app.description.create"
                                        )}
                                   />
                              </ul>
                              <div className="mt-8">
                                   <SignInButton className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200" />
                              </div>
                         </div>
                         <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                              <Image
                                   src="/images/help.png"
                                   alt="Home Inventory Dashboard Preview"
                                   width={800}
                                   height={800}
                                   style={{
                                        borderRadius: "1rem",
                                        objectFit: "cover",
                                   }}
                                   className="shadow-2xl transform hover:scale-110"
                              />
                         </div>
                    </div>

                    <section className="text-center">
                         <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
                              {t("app.headers.how")}
                         </h2>
                         <div className="grid md:grid-cols-3 gap-8">
                              <StepCard
                                   number={1}
                                   title={t("app.title.sign")}
                                   description={t("app.description.account")}
                              />
                              <StepCard
                                   number={2}
                                   title={t("app.title.add")}
                                   description={t("app.description.addRooms")}
                              />
                              <StepCard
                                   number={3}
                                   title={t("app.title.add")}
                                   description={t("app.description.report")}
                              />
                         </div>
                    </section>
               </div>
          </div>
     );
}

function FeatureItem({
     icon,
     title,
     description,
}: {
     icon: React.ReactNode;
     title: string;
     description: string;
}) {
     return (
          <li className="flex items-start">
               <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-white bg-opacity-20 text-white">
                         {icon}
                    </div>
               </div>
               <div className="ml-4">
                    <h3 className="text-lg font-medium text-white">{title}</h3>
                    <p className="mt-2 text-base text-gray-200">
                         {description}
                    </p>
               </div>
          </li>
     );
}

function StepCard({
     number,
     title,
     description,
}: {
     number: number;
     title: string;
     description: string;
}) {
     return (
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-xl transform hover:scale-105 transition-transform duration-300">
               <div className="w-12 h-12 bg-white text-indigo-600 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                    {number}
               </div>
               <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
               <p className="text-gray-200">{description}</p>
          </div>
     );
}
