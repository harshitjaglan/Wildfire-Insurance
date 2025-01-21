import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { roomId: string } }
) {
  const { name } = await request.json();

  const updatedRoom = await prisma.room.update({
    where: { id: params.roomId },
    data: { name },
  });

  return NextResponse.json(updatedRoom);
}
