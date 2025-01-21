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
    include: {
      rooms: {
        include: {
          items: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/");
  }

  return <RoomsClient user={user} />;
}
