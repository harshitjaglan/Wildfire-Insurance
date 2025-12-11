"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { t } from "../../i18n";

interface Item {
     id: string;
     name: string;
     description: string | null;
     value: number;
     brand: string | null;
     modelNumber: string | null;
     serialNumber: string | null;
     room: {
          id: string;
          name: string;
     };
     createdAt: Date;
     updatedAt: Date;
}

export function AllItemsClient({ items }: { items: Item[] }) {
     const [itemsState, setItems] = useState(items);
     const totalValue = items.reduce((sum, item) => sum + item.value, 0);

     const handleGeneratePDF = async () => {
          try {
               const response = await fetch("/api/pdf");
               if (!response.ok) throw new Error("Failed to generate PDF");

               // Create a blob from the PDF stream
               const blob = await response.blob();

               // Create a link to download the PDF
               const url = window.URL.createObjectURL(blob);
               const link = document.createElement("a");
               link.href = url;
               link.download = "home-inventory.pdf";

               // Trigger the download
               document.body.appendChild(link);
               link.click();

               // Clean up
               document.body.removeChild(link);
               window.URL.revokeObjectURL(url);
          } catch (error) {
               console.error("Error generating PDF:", error);
               alert("Failed to generate PDF. Please try again.");
          }
     };

     return (
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
               <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                         <h1 className="text-2xl font-semibold">
                              {t("headers.allItems")}
                         </h1>
                         <div className="flex items-center gap-4">
                              <div className="text-lg font-medium">
                                   {t("div.totalValue")}{" "}
                                   {totalValue.toLocaleString()}
                              </div>
                              <button
                                   onClick={handleGeneratePDF}
                                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                              >
                                   {t("buttons.generate")}
                              </button>
                         </div>
                    </div>

                    {/* Grid of Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {itemsState.map((item) => (
                              <div
                                   key={item.id}
                                   className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
                              >
                                   {/* Entire Card Clickable */}
                                   <Link
                                        href={`/items/${item.id}`}
                                        className="block"
                                   >
                                        <h3 className="text-xl font-medium hover:text-blue-600">
                                             {item.name}
                                        </h3>
                                   </Link>

                                   <Link
                                        href={`/rooms/${item.room.id}`}
                                        className="text-sm text-blue-500 hover:text-blue-600"
                                   >
                                        {item.room.name}
                                   </Link>

                                   <div className="mt-4 space-y-2">
                                        <p className="text-gray-600">
                                             {item.description ||
                                                  "No description added"}
                                        </p>
                                        <p className="text-green-600 font-medium">
                                             ${item.value}
                                        </p>

                                        {/* Optional Details Section */}
                                        <div className="space-y-1 text-sm">
                                             {!item.brand && (
                                                  <Link
                                                       href={`/items/${item.id}`}
                                                       className="text-gray-400 hover:text-blue-600 block"
                                                  >
                                                       {t("link.addBrand")}
                                                  </Link>
                                             )}
                                             {!item.modelNumber && (
                                                  <Link
                                                       href={`/items/${item.id}`}
                                                       className="text-gray-400 hover:text-blue-600 block"
                                                  >
                                                       {t("link.addModel")}
                                                  </Link>
                                             )}
                                             {!item.serialNumber && (
                                                  <Link
                                                       href={`/items/${item.id}`}
                                                       className="text-gray-400 hover:text-blue-600 block"
                                                  >
                                                       {t("link.addSerial")}
                                                  </Link>
                                             )}
                                        </div>

                                        {/* Show existing details if present */}
                                        {(item.brand ||
                                             item.modelNumber ||
                                             item.serialNumber) && (
                                             <div className="space-y-1 text-sm">
                                                  {item.brand && (
                                                       <p>
                                                            <span className="text-gray-500">
                                                                 Brand:
                                                            </span>{" "}
                                                            {item.brand}
                                                       </p>
                                                  )}
                                                  {item.modelNumber && (
                                                       <p>
                                                            <span className="text-gray-500">
                                                                 Model:
                                                            </span>{" "}
                                                            {item.modelNumber}
                                                       </p>
                                                  )}
                                                  {item.serialNumber && (
                                                       <p>
                                                            <span className="text-gray-500">
                                                                 Serial:
                                                            </span>{" "}
                                                            {item.serialNumber}
                                                       </p>
                                                  )}
                                             </div>
                                        )}
                                   </div>
                              </div>
                         ))}
                    </div>
               </div>
          </div>
     );
}
