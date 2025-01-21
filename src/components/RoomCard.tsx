"use client";

import { useState } from "react";
import Link from "next/link";

interface RoomCardProps {
  id: string;
  name: string;
  itemCount: number;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, name: string) => Promise<void>;
}

export function RoomCard({
  id,
  name: initialName,
  itemCount,
  onDelete,
  onUpdate,
}: RoomCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);

  const handleUpdate = async () => {
    await onUpdate(id, name);
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {isEditing ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 border rounded px-2 py-1"
          />
          <button
            onClick={handleUpdate}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-medium">{name}</h2>
          <p className="text-gray-500 mb-4">{itemCount} items</p>
          <div className="flex gap-2">
            <Link
              href={`/rooms/${id}`}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              View Items
            </Link>
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(id)}
              className="text-red-500 hover:text-red-600"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
