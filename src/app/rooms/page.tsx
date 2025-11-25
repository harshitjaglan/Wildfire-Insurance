import { getServerSession } from "next-auth";
import { OPTIONS } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RoomsClient } from "./client";

export default async function RoomsPage() {
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

  const memberships = await prisma.roomMembership.findMany({
    where: { userId: user.id },
    include: {
      room: {
        include: {
          items: true,
        },
      },
    },
  });

  const rooms = memberships.map((m) => m.room);

  return <RoomsClient user={{ id: user.id, rooms }} />;
}
