"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Item {
  id: string;
  name: string;
  description: string | null;
  value: number;
  brand: string | null;
  modelNumber: string | null;
  serialNumber: string | null;
  roomId: string;
  userId: string;
}

interface Room {
  id: string;
  name: string;
  items: Item[];
}

type NewItemForm = {
  name: string;
  description: string;
  value: string; // Allowing string to handle empty input
};

export function RoomClient({ room: initialRoom }: { room: Room }) {
  const [room, setRoom] = useState<Room>(initialRoom);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(room.name);
  const [items, setItems] = useState(initialRoom.items);
  const [newItem, setNewItem] = useState<NewItemForm>({
    name: "",
    description: "",
    value: "",
  });
  const [error, setError] = useState<string | null>(null); // For error handling

  const handleUpdateName = async () => {
    try {
      const res = await fetch(`/api/rooms/${room.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });

      if (res.ok) {
        const updatedRoom = await res.json();
        setRoom(updatedRoom);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update room name:", error);
    }
  };

  const addItem = async () => {
    const numericValue = parseFloat(newItem.value);

    // Validation: Check if the value is a valid number and non-negative
    if (isNaN(numericValue) || numericValue < 0) {
      setError("Please enter a valid non-negative number for value.");
      return;
    }

    const itemToAdd: Omit<Item, "id" | "documents"> = {
      name: newItem.name,
      description: newItem.description || null,
      value: numericValue,
      brand: null,
      modelNumber: null,
      serialNumber: null,
      roomId: room.id,
      userId: "",
    };

    try {
      const res = await fetch(`/api/rooms/${room.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemToAdd),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const item: Item = await res.json();
      setItems([...items, item]);
      setNewItem({ name: "", description: "", value: "" });
      setError(null); // Clear any existing errors
    } catch (error) {
      setError("Failed to add item. Please try again.");
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Update both room and items state
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
        setRoom((prev) => ({
          ...prev,
          items: prev.items.filter((item) => item.id !== itemId),
        }));
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete item. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <Link
          href="/rooms"
          className="text-blue-500 hover:text-blue-600 mb-6 inline-block"
        >
          ← Back to Rooms
        </Link>

        {/* Editable Room Name */}
        <div className="flex items-center gap-4 mb-6">
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border rounded px-2 py-1"
              />
              <button
                onClick={handleUpdateName}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">{room.name}</h1>
              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✏️
              </button>
            </div>
          )}
        </div>

        {/* Add Item Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Add New Item</h2>
          {error && <div className="mb-4 text-red-500">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Description"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Value"
              value={newItem.value}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  value: e.target.value, // Keep as string
                })
              }
              step="0.01"
              min="0"
              className="border rounded px-3 py-2"
            />
          </div>
          <button
            onClick={addItem}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Item
          </button>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{item.name}</h3>
                  <p className="text-gray-500 mt-1">{item.description}</p>
                  <p className="text-green-600 font-medium">
                    ${item.value.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/items/${item.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
