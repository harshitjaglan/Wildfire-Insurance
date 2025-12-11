import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - List all collaborators for a room
export async function GET(
  req: Request,
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

  // Verify user has access to this room
  const membership = await prisma.roomMembership.findFirst({
    where: {
      roomId: params.roomId,
      userId: user.id,
    },
  });

  if (!membership) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Get all collaborators for this room
  const collaborators = await prisma.roomMembership.findMany({
    where: {
      roomId: params.roomId,
    },
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
    orderBy: [
      { role: "asc" }, // OWNER first, then EDITOR, then VIEWER
      { createdAt: "asc" },
    ],
  });

  return NextResponse.json(collaborators);
}

// POST - Add a new collaborator by email
export async function POST(
  req: Request,
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

  // Only OWNER can add collaborators
  const isOwner = await prisma.roomMembership.findFirst({
    where: {
      roomId: params.roomId,
      userId: user.id,
      role: "OWNER",
    },
  });

  if (!isOwner) {
    return new NextResponse("Forbidden - only owners can add collaborators", {
      status: 403,
    });
  }

  const { email, role = "VIEWER" } = await req.json();

  if (!email) {
    return new NextResponse("Email is required", { status: 400 });
  }

  // Find user by email
  const collaboratorUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!collaboratorUser) {
    return new NextResponse("User not found with that email", { status: 404 });
  }

  // Check if already a member
  const existingMembership = await prisma.roomMembership.findUnique({
    where: {
      roomId_userId: {
        roomId: params.roomId,
        userId: collaboratorUser.id,
      },
    },
  });

  if (existingMembership) {
    return new NextResponse("User is already a collaborator", { status: 400 });
  }

  // Create membership
  const membership = await prisma.roomMembership.create({
    data: {
      roomId: params.roomId,
      userId: collaboratorUser.id,
      role,
    },
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