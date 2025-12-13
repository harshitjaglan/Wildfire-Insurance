import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  const session = await getServerSession(OPTIONS);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  // Check if user has OWNER or EDITOR role
  const hasAccess = await prisma.roomMembership.findFirst({
    where: {
      roomId: params.roomId,
      userId: user.id,
      role: { in: ["OWNER", "EDITOR"] },
    },
  });

  if (!hasAccess) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { name } = await request.json();

  const updatedRoom = await prisma.room.update({
    where: { id: params.roomId },
    data: { name },
  });

  return NextResponse.json(updatedRoom);
}