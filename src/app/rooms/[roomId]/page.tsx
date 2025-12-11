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

  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
      userId: user.id,
    },
    include: {
      items: true,
    },
  });

  if (!room) {
    redirect("/rooms");
  }

  return <RoomClient room={room} />;
}
