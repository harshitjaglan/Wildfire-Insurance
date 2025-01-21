"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export function RoomsClient({ user }: { user: User }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

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

      if (!res.ok) throw new Error("Failed to create room");

      setRoomName("");
      setIsModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create room. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Your Rooms</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add New Room
          </button>
        </div>

        {user.rooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No rooms yet. Add your first room to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <Link href={`/rooms/${room.id}`}>
                  <h2 className="text-xl font-medium mb-4">{room.name}</h2>
                </Link>
                <div className="space-y-2">
                  <h2 className="text-sm mb-2 text-gray-700 font-bold">
                    Items
                  </h2>

                  {room.items.slice(0, 3).map((item) => (
                    <Link
                      key={item.id}
                      href={`/items/${item.id}`}
                      className="block rounded hover:underline transition-colors mt-2"
                    >
                      {item.name}
                    </Link>
                  ))}
                  {room.items.length > 3 && (
                    <p className="text-sm text-gray-500 mt-2">
                      +{room.items.length - 3} more items
                    </p>
                  )}
                  {room.items.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No items in this room
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Add New Room</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Room Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Create Room
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
