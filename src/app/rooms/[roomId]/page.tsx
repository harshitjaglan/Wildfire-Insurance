import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RoomClient } from "@/app/rooms/[roomId]/client";

export default async function RoomItemsPage({
  params: { roomId },
}: {
  params: { roomId: string };
}) {
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

  const membership = await prisma.roomMembership.findFirst({
    where: {
      roomId,
      userId: user.id,
    },
    include: {
      room: {
        include: {
          items: true,
        },
      },
    },
  });

  if (!membership) {
    redirect("/rooms");
  }

  return <RoomClient room={membership.room} userId={user.id} />;
}