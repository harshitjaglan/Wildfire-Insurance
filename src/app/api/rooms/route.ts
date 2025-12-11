import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(OPTIONS);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { name } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const room = await prisma.room.create({
    data: {
      name,
      userId: user.id,
      memberships: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
    include: {
      _count: {
        select: { items: true },
      },
    },
  });

  return NextResponse.json(room);
}

export async function PUT(req: Request) {
  const session = await getServerSession(OPTIONS);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id, name } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const hasAccess = await prisma.roomMembership.findFirst({
    where: {
      roomId: id,
      userId: user.id,
      role: { in: ["OWNER", "EDITOR"] },
    },
  });

  if (!hasAccess) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const room = await prisma.room.update({
    where: {
      id,
    },
    data: { name },
    include: {
      _count: {
        select: { items: true },
      },
    },
  });

  return NextResponse.json(room);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(OPTIONS);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const isOwner = await prisma.roomMembership.findFirst({
    where: {
      roomId: id,
      userId: user.id,
      role: "OWNER",
    },
  });

  if (!isOwner) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  await prisma.room.delete({
    where: {
      id,
    },
  });

  return new NextResponse(null, { status: 204 });
}