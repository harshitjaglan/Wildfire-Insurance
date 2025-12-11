import { getServerSession } from "next-auth";
import { OPTIONS } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { t  } from "../../../../i18n";

export async function PUT(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(OPTIONS);
    if (!session?.user?.email) {
      return new NextResponse(t("items.handlers.unauthorized"), { status: 401 });
    }

    const json = await request.json();
    const { name } = json;

    const user = await prisma.user.update({
      where: { id: params.userId },
      data: { name },
    });

    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse(t("user.handlers.update"), { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(OPTIONS);
    if (!session?.user?.email) {
      return new NextResponse(t("items.handlers.unauthorized"), { status: 401 });
    }

    await prisma.user.delete({
      where: { id: params.userId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse(t("user.handlers.delete"), { status: 500 });
  }
}
