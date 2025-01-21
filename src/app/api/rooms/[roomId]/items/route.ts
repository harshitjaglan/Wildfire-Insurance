import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  const session = await getServerSession(OPTIONS);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { name, description, value } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  // Verify room belongs to user
  const room = await prisma.room.findUnique({
    where: {
      id: params.roomId,
      userId: user.id,
    },
  });

  if (!room) {
    return new NextResponse("Room not found", { status: 404 });
  }

  const item = await prisma.item.create({
    data: {
      name,
      description,
      value,
      roomId: params.roomId,
      userId: user.id,
    },
  });

  return NextResponse.json(item);
}

export async function DELETE(
  req: Request,
  { params }: { params: { roomId: string; itemId: string } }
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

  // Verify room and item belong to user
  const room = await prisma.room.findUnique({
    where: {
      id: params.roomId,
      userId: user.id,
    },
    include: {
      items: {
        where: {
          id: params.itemId,
        },
      },
    },
  });

  if (!room || room.items.length === 0) {
    return new NextResponse("Item not found", { status: 404 });
  }

  await prisma.item.delete({
    where: {
      id: params.itemId,
    },
  });

  return new NextResponse(null, { status: 204 });
}
