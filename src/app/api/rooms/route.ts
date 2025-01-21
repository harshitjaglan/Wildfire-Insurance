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

  const room = await prisma.room.update({
    where: {
      id,
      userId: user.id,
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

  await prisma.room.delete({
    where: {
      id,
      userId: user.id,
    },
  });

  return new NextResponse(null, { status: 204 });
}
