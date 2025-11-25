import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// PATCH - Update collaborator role
export async function PATCH(
  req: Request,
  { params }: { params: { roomId: string; userId: string } }
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

  // Only OWNER can change roles
  const isOwner = await prisma.roomMembership.findFirst({
    where: {
      roomId: params.roomId,
      userId: user.id,
      role: "OWNER",
    },
  });

  if (!isOwner) {
    return new NextResponse("Forbidden - only owners can change roles", {
      status: 403,
    });
  }

  const { role } = await req.json();

  if (!role || !["OWNER", "EDITOR", "VIEWER"].includes(role)) {
    return new NextResponse("Invalid role", { status: 400 });
  }

  // Prevent changing own role if you're the only owner
  if (params.userId === user.id && role !== "OWNER") {
    const ownerCount = await prisma.roomMembership.count({
      where: {
        roomId: params.roomId,
        role: "OWNER",
      },
    });

    if (ownerCount === 1) {
      return new NextResponse(
        "Cannot change role - room must have at least one owner",
        { status: 400 }
      );
    }
  }

  // Update membership
  const membership = await prisma.roomMembership.update({
    where: {
      roomId_userId: {
        roomId: params.roomId,
        userId: params.userId,
      },
    },
    data: { role },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return NextResponse.json(membership);
}

// DELETE - Remove collaborator
export async function DELETE(
  req: Request,
  { params }: { params: { roomId: string; userId: string } }
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

  // Only OWNER can remove collaborators (or users can remove themselves)
  const isOwner = await prisma.roomMembership.findFirst({
    where: {
      roomId: params.roomId,
      userId: user.id,
      role: "OWNER",
    },
  });

  const isSelf = params.userId === user.id;

  if (!isOwner && !isSelf) {
    return new NextResponse(
      "Forbidden - only owners can remove collaborators",
      { status: 403 }
    );
  }

  // Prevent removing the last owner
  if (isSelf || params.userId === user.id) {
    const membershipToRemove = await prisma.roomMembership.findUnique({
      where: {
        roomId_userId: {
          roomId: params.roomId,
          userId: params.userId,
        },
      },
    });

    if (membershipToRemove?.role === "OWNER") {
      const ownerCount = await prisma.roomMembership.count({
        where: {
          roomId: params.roomId,
          role: "OWNER",
        },
      });

      if (ownerCount === 1) {
        return new NextResponse(
          "Cannot remove - room must have at least one owner",
          { status: 400 }
        );
      }
    }
  }

  // Delete membership
  await prisma.roomMembership.delete({
    where: {
      roomId_userId: {
        roomId: params.roomId,
        userId: params.userId,
      },
    },
  });

  return new NextResponse(null, { status: 204 });
}
