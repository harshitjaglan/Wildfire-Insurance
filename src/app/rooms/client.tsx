"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
     Bed,
     Sofa,
     CookingPotIcon as Kitchen,
     Bath,
     Plus,
     X,
     ChevronRight,
     Box,
     Home,
     Warehouse,
} from "lucide-react";


interface Item {
     id: string;
     name: string;
}

interface Room {
     id: string;
     name: string;
     items: Item[];
}

interface User {
     id: string;
     rooms: Room[];
}

type ClientLabels = {
    rooms: string;
    items: string;
    roomFail1: string;
    roomFail2: string;
    room1: string;
    add1: string;
    no: string;
    more: string;
    name: string;
    cancel: string;
    create: string;
    room2: string;
    add2: string;
};

const roomIcons: { [key: string]: any } = {
     bedroom: Bed,
     living: Sofa,
     kitchen: Kitchen,
     bathroom: Bath,
     default: Warehouse,
};

export function RoomsClient({ user, labels }: { user: User; labels: ClientLabels }) {
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [roomName, setRoomName] = useState("");
     const router = useRouter();

     const getRoomIcon = (roomName: string) => {
          const normalizedName = roomName.toLowerCase();
          for (const [key, icon] of Object.entries(roomIcons)) {
               if (normalizedName.includes(key)) return icon;
          }
          return roomIcons.default;
     };

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          try {
               const res = await fetch("/api/rooms", {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                         name: roomName,
                         userId: user.id,
                    }),
               });

               if (!res.ok) throw new Error(labels.roomFail1);

               setRoomName("");
               setIsModalOpen(false);
               router.refresh();
          } catch (error) {
               console.error("Error:", error);
               alert(labels.roomFail2);
          }
     };

     return (
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
               <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-8">
                         <div className="flex items-center gap-3">
                              <Home className="h-8 w-8 text-indigo-600" />
                              <h1 className="text-3xl font-bold text-gray-900">
                                   {labels.rooms}
                              </h1>
                         </div>
                         <button
                              onClick={() => setIsModalOpen(true)}
                              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md">
                              <Plus className="h-5 w-5" />
                              {labels.room2}
                         </button>
                    </div>

                    {user.rooms.length === 0 ? (
                         <div className="text-center py-12 bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300">
                              <div className="flex flex-col items-center gap-4">
                                   <Warehouse className="h-12 w-12 text-gray-400" />
                                   <div>
                                        <p className="text-xl font-medium text-gray-900 mb-1">
                                             {labels.room1}
                                        </p>
                                        <p className="text-gray-500">
                                             {labels.add1}
                                        </p>
                                   </div>
                                   <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 mt-4">
                                        <Plus className="h-5 w-5" />
                                        {labels.add2}
                                   </button>
                              </div>
                         </div>
                    ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {user.rooms.map((room) => {
                                   const RoomIcon = getRoomIcon(room.name);
                                   return (
                                        <div
                                             key={room.id}
                                             className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
                                             <Link
                                                  href={`/rooms/${room.id}`}
                                                  className="block">
                                                  <div className="p-6">
                                                       <div className="flex items-start justify-between mb-4">
                                                            <div className="flex items-center gap-3">
                                                                 <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors duration-200">
                                                                      <RoomIcon className="h-6 w-6 text-indigo-600" />
                                                                 </div>
                                                                 <h2 className="text-xl font-semibold text-gray-900">
                                                                      {
                                                                           room.name
                                                                      }
                                                                 </h2>
                                                            </div>
                                                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" />
                                                       </div>
                                                       <div className="space-y-3">
                                                            <div className="flex items-center gap-2">
                                                                 <Box className="h-4 w-4 text-gray-400" />
                                                                 <h3 className="text-sm font-medium text-gray-700">
                                                                      {labels.items}{" "}
                                                                      (
                                                                      {
                                                                           room
                                                                                .items
                                                                                .length
                                                                      }
                                                                      )
                                                                 </h3>
                                                            </div>
                                                            <div className="space-y-2">
                                                                 {room.items
                                                                      .length ===
                                                                 0 ? (
                                                                      <p className="text-sm text-gray-500 italic">
                                                                           {labels.no}
                                                                      </p>
                                                                 ) : (
                                                                      <>
                                                                           <div className="space-y-1">
                                                                                {room.items
                                                                                     .slice(
                                                                                          0,
                                                                                          3
                                                                                     )
                                                                                     .map(
                                                                                          (
                                                                                               item
                                                                                          ) => (
                                                                                               <Link
                                                                                                    key={
                                                                                                         item.id
                                                                                                    }
                                                                                                    href={`/items/${item.id}`}
                                                                                                    className="block text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 py-1">
                                                                                                    {
                                                                                                         item.name
                                                                                                    }
                                                                                               </Link>
                                                                                          )
                                                                                     )}
                                                                           </div>
                                                                           {room
                                                                                .items
                                                                                .length >
                                                                                3 && (
                                                                                <p className="text-sm font-medium text-indigo-600">
                                                                                     +
                                                                                     {room
                                                                                          .items
                                                                                          .length -
                                                                                          3}{" "}
                                                                                     {labels.more}
                                                                                </p>
                                                                           )}
                                                                      </>
                                                                 )}
                                                            </div>
                                                       </div>
                                                  </div>
                                             </Link>
                                        </div>
                                   );
                              })}
                         </div>
                    )}

                    {/* Modal */}
                    {isModalOpen && (
                         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                                   <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                             {labels.add2}
                                        </h2>
                                        <button
                                             onClick={() =>
                                                  setIsModalOpen(false)
                                             }
                                             className="text-gray-400 hover:text-gray-600 transition-colors">
                                             <X className="h-5 w-5" />
                                        </button>
                                   </div>
                                   <form
                                        onSubmit={handleSubmit}
                                        className="space-y-4">
                                        <div>
                                             <label
                                                  htmlFor="name"
                                                  className="block text-sm font-medium text-gray-700 mb-1">
                                                  {labels.name}
                                             </label>
                                             <input
                                                  type="text"
                                                  id="name"
                                                  value={roomName}
                                                  onChange={(e) =>
                                                       setRoomName(
                                                            e.target.value
                                                       )
                                                  }
                                                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200"
                                                  placeholder="e.g., Living Room, Kitchen, Bedroom"
                                                  required
                                             />
                                        </div>
                                        <div className="flex justify-end gap-3 pt-4">
                                             <button
                                                  type="button"
                                                  onClick={() =>
                                                       setIsModalOpen(false)
                                                  }
                                                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium">
                                                  {labels.cancel}
                                             </button>
                                             <button
                                                  type="submit"
                                                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium">
                                                  {labels.create}
                                             </button>
                                        </div>
                                   </form>
                              </div>
                         </div>
                    )}
               </div>
          </div>
     );
}
