"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Item } from "@prisma/client";

export function ItemForm({ initialItem }: { initialItem: Item }) {
  const [formData, setFormData] = useState({
    name: initialItem.name,
    brand: initialItem.brand || "",
    modelNumber: initialItem.modelNumber || "",
    serialNumber: initialItem.serialNumber || "",
    value: initialItem.value.toString(),
    description: initialItem.description || "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/items/${initialItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          value: parseFloat(formData.value),
        }),
      });

      if (!res.ok) throw new Error("Failed to update item");

      router.push("/items");
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update item. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
        <p className="text-orange-700">
          💡 Pro Tip: Adding detailed information helps ensure fair replacement
          value from insurance companies. Without specifics, they may default to
          lowest-cost replacements.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="brand"
            className="block text-sm font-medium text-gray-700"
          >
            Brand
          </label>
          <input
            type="text"
            id="brand"
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Specifying brand name helps ensure like-quality replacement
          </p>
        </div>

        <div>
          <label
            htmlFor="modelNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Model Number
          </label>
          <input
            type="text"
            id="modelNumber"
            value={formData.modelNumber}
            onChange={(e) =>
              setFormData({ ...formData, modelNumber: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="serialNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Serial Number
          </label>
          <input
            type="text"
            id="serialNumber"
            value={formData.serialNumber}
            onChange={(e) =>
              setFormData({ ...formData, serialNumber: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Important for electronics and high-value items
          </p>
        </div>

        <div>
          <label
            htmlFor="value"
            className="block text-sm font-medium text-gray-700"
          >
            Purchase Price
          </label>
          <input
            type="number"
            id="value"
            value={formData.value}
            onChange={(e) =>
              setFormData({ ...formData, value: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min="0"
            step="0.01"
          />
          <p className="mt-1 text-sm text-gray-500">
            Helps establish item value for insurance claims
          </p>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Detailed Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
          <p className="mt-1 text-sm text-gray-500">
            Include specific features, materials, and condition
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Add Photos
          </label>
          <input
            type="file"
            className="mt-1 block w-full"
            multiple
            accept="image/*"
          />
          <p className="mt-1 text-sm text-gray-500">
            Visual proof of ownership and condition
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
