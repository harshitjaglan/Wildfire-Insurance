import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AllItemsClient } from "./client";

export default async function AllItemsPage() {
  const session = await getServerSession(OPTIONS);

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/");
  }

  // Get all items across all rooms
  const items = await prisma.item.findMany({
    where: {
      room: {
        userId: user.id,
      },
    },
    include: {
      room: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <AllItemsClient items={items} />;
}
