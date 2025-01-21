import { getServerSession } from "next-auth";
import { OPTIONS } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
export default async function DashboardPage() {
  const session = await getServerSession(OPTIONS);

  if (!session?.user?.email) {
    redirect("/");
    return null;
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
      sum + room.items.reduce((roomSum, item) => roomSum + item.value, 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Profile section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            {session?.user?.image && (
              <Image
                src={session.user.image}
                alt="Profile"
                width={60}
                height={60}
                className="rounded-full"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome, {session?.user?.name}!
              </h2>
              <p className="text-gray-500">{session?.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Get Started Section */}
        <div className="text-center py-12">
          <h3 className="text-2xl font-medium text-gray-900 mb-4">
            Let's organize your home inventory
          </h3>
          <p className="text-gray-500 mb-8">
            Start by creating rooms and adding items to track your belongings
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link
              href="/rooms/new"
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Add Rooms
              </h4>
              <p className="text-gray-500">
                Create rooms to organize your items
              </p>
            </Link>

            <Link
              href="/items/new"
              className="flex flex-col items-center p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Add Items
              </h4>
              <p className="text-gray-500">Start tracking your belongings</p>
            </Link>
          </div>
        </div>

        {roomCount === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-4">
              Let's get started with your home inventory!
            </h3>
            <p className="text-gray-500 mb-8">
              Begin by adding rooms to organize your items.
            </p>
            <Link
              href="/rooms/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Your First Room
            </Link>
          </div>
        ) : (
          // Existing stats overview
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Link
                href="/rooms"
                className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Manage Rooms
                </h3>
                <p className="text-gray-500">Organize your items by room</p>
              </Link>

              <Link
                href="/items"
                className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  View Items
                </h3>
                <p className="text-gray-500">See all your documented items</p>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Total Rooms
                </h3>
                <p className="text-3xl font-bold text-blue-600">{roomCount}</p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Total Items
                </h3>
                <p className="text-3xl font-bold text-green-600">{itemCount}</p>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Total Value
                </h3>
                <p className="text-3xl font-bold text-purple-600">
                  ${totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
