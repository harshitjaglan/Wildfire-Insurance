import { getServerSession } from "next-auth";
import { OPTIONS } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
     FaHome,
     FaBoxOpen,
     FaFileAlt,
     FaUsers,
     FaChartLine,
} from "react-icons/fa";
import { Footer } from "@/components/Footer";
import { t } from "../../i18n";

export default async function DashboardPage() {
     const session = await getServerSession(OPTIONS);

     if (!session?.user?.email) {
          redirect("/");
     }

     try {
          const user = await prisma.user.findUnique({
               where: { email: session.user.email },
               include: {
                    rooms: {
                         include: {
                              items: true,
                         },
                    },
               },
          });
          if (!user) {
               throw new Error("User not found");
          }
     } catch (error) {
          if (error instanceof Error) {
               console.error("Database error:", error.message);
          } else {
               console.error("Unknown error:", error);
          }
     }

     const user = await prisma.user.findUnique({
          where: {
               email: session.user.email,
          },
          include: {
               rooms: {
                    include: {
                         items: true,
                    },
               },
          },
     });

     if (!user) {
          return null;
     }

     const roomCount = user.rooms.length;
     const itemCount = user.rooms.reduce(
          (sum, room) => sum + room.items.length,
          0
     );
     const totalValue = user.rooms.reduce(
          (sum, room) =>
               sum +
               room.items.reduce((roomSum, item) => roomSum + item.value, 0),
          0
     );

     return (
          <>
               <div className="flex-grow">
                    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                         <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                              {/* Header section */}
                              <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
                                   <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                             {session.user.image && (
                                                  <Image
                                                       src={
                                                            session.user
                                                                 .image ||
                                                            "/placeholder.svg"
                                                       }
                                                       alt="Profile"
                                                       width={60}
                                                       height={60}
                                                       className="rounded-full border-2 border-indigo-500"
                                                  />
                                             )}
                                             <div>
                                                  <h2 className="text-2xl font-bold text-gray-900">
                                                       {t(
                                                            "dashboard.headers.welcome"
                                                       )}{" "}
                                                       {session.user.name}!
                                                  </h2>
                                                  <p className="text-indigo-600">
                                                       {session.user.email}
                                                  </p>
                                             </div>
                                        </div>
                                        <Link
                                             href="/profile"
                                             className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                        >
                                             {t("dashboard.link.edit")}
                                        </Link>
                                   </div>
                              </div>

                              {roomCount === 0 ? (
                                   // Empty state
                                   <div className="text-center py-12 bg-white shadow-lg rounded-2xl p-8">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                             {t("dashboard.headers.start")}
                                        </h3>
                                        <p className="whitespace-pre-line text-gray-600 mb-8 max-w-2xl mx-auto">
                                             {t("dashboard.paragraphs.start")}
                                        </p>
                                        <Link
                                             href="/rooms/new"
                                             className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                                        >
                                             <FaHome className="mr-2" />{" "}
                                             {t("dashboard.link.firstHome")}
                                        </Link>
                                   </div>
                              ) : (
                                   // Dashboard for users with rooms
                                   <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                             <Link
                                                  href="/rooms"
                                                  className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-shadow flex items-center space-x-4"
                                             >
                                                  <div className="bg-indigo-100 p-3 rounded-full">
                                                       <FaHome className="text-2xl text-indigo-600" />
                                                  </div>
                                                  <div>
                                                       <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                            {t(
                                                                 "dashboard.headers.room"
                                                            )}
                                                       </h3>
                                                       <p className="text-gray-600">
                                                            {t(
                                                                 "dashboard.paragraphs.manage"
                                                            )}
                                                       </p>
                                                  </div>
                                             </Link>

                                             <Link
                                                  href="/items"
                                                  className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-shadow flex items-center space-x-4"
                                             >
                                                  <div className="bg-green-100 p-3 rounded-full">
                                                       <FaBoxOpen className="text-2xl text-green-600" />
                                                  </div>
                                                  <div>
                                                       <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                            {t(
                                                                 "dashboard.headers.item"
                                                            )}
                                                       </h3>
                                                       <p className="text-gray-600">
                                                            {t(
                                                                 "dashboard.paragraphs.manage"
                                                            )}
                                                       </p>
                                                  </div>
                                             </Link>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                             <div className="bg-white shadow-lg rounded-2xl p-6">
                                                  <div className="flex items-center justify-between mb-4">
                                                       <h3 className="text-lg font-bold text-gray-900">
                                                            {t(
                                                                 "dashboard.headers.totalRoom"
                                                            )}
                                                       </h3>
                                                       <FaHome className="text-2xl text-indigo-600" />
                                                  </div>
                                                  <p className="text-3xl font-bold text-indigo-600">
                                                       {roomCount}
                                                  </p>
                                             </div>
                                             <div className="bg-white shadow-lg rounded-2xl p-6">
                                                  <div className="flex items-center justify-between mb-4">
                                                       <h3 className="text-lg font-bold text-gray-900">
                                                            {t(
                                                                 "dashboard.headers.totalItem"
                                                            )}
                                                       </h3>
                                                       <FaBoxOpen className="text-2xl text-green-600" />
                                                  </div>
                                                  <p className="text-3xl font-bold text-green-600">
                                                       {itemCount}
                                                  </p>
                                             </div>
                                             <div className="bg-white shadow-lg rounded-2xl p-6">
                                                  <div className="flex items-center justify-between mb-4">
                                                       <h3 className="text-lg font-bold text-gray-900">
                                                            {t(
                                                                 "dashboard.headers.totalValue"
                                                            )}
                                                       </h3>
                                                       <FaChartLine className="text-2xl text-purple-600" />
                                                  </div>
                                                  <p className="text-3xl font-bold text-purple-600">
                                                       $
                                                       {totalValue.toLocaleString()}
                                                  </p>
                                             </div>
                                        </div>

                                        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link
                    href="/documentation"
                    className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-shadow flex items-center space-x-4"
                  >
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <FaFileAlt className="text-2xl text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Documentation
                      </h3>
                      <p className="text-gray-600">
                        Upload and manage supporting documents
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/collaboration"
                    className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-shadow flex items-center space-x-4"
                  >
                    <div className="bg-red-100 p-3 rounded-full">
                      <FaUsers className="text-2xl text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Collaboration
                      </h3>
                      <p className="text-gray-600">
                        Invite others to help with your claim
                      </p>
                    </div>
                  </Link>
                </div> */}

                                        {/* <div className="bg-white shadow-lg rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Claim Progress
                  </h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                  <p className="text-gray-600">
                    Your claim is 45% complete. Keep going!
                  </p>
                </div> */}
                                   </div>
                              )}
                         </div>
                    </div>
               </div>
               <Footer />
          </>
     );
}
