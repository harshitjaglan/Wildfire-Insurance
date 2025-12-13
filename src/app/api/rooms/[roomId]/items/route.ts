import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { t } from "../../../../../i18n";

export async function POST(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  const session = await getServerSession(OPTIONS);

  if (!session?.user?.email) {
    return new NextResponse(t("items.handlers.unauthorized"), { status: 401 });
  }

  const { name, description, value } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new NextResponse(t("pdf.handlers.user"), { status: 404 });
  }

  // Verify user has access to room (OWNER or EDITOR can add items)
  const membership = await prisma.roomMembership.findFirst({
    where: {
      roomId: params.roomId,
      userId: user.id,
      role: { in: ["OWNER", "EDITOR"] },
    },
  });

  if (!membership) {
    return new NextResponse(t("items.handlers.room"), { status: 403 });
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
    return new NextResponse(t("items.handlers.unauthorized"), { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new NextResponse(t("pdf.handlers.user"), { status: 404 });
  }

  // Verify user has access to room (OWNER or EDITOR can delete items)
  const membership = await prisma.roomMembership.findFirst({
    where: {
      roomId: params.roomId,
      userId: user.id,
      role: { in: ["OWNER", "EDITOR"] },
    },
  });

  if (!membership) {
    return new NextResponse(t("items.handlers.room"), { status: 403 });
  }

  // Verify item exists in this room
  const item = await prisma.item.findFirst({
    where: {
      id: params.itemId,
      roomId: params.roomId,
    },
  });

  if (!item) {
    return new NextResponse(t("items.handlers.item"), { status: 404 });
  }

  await prisma.item.delete({
    where: {
      id: params.itemId,
    },
  });

  return new NextResponse(null, { status: 204 });
}