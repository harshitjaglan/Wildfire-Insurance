import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { OPTIONS } from "../../auth/[...nextauth]/route";
import { t } from "../../../../i18n";

export async function DELETE(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    await prisma.item.delete({
      where: {
        id: params.itemId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(t("items.handlers.delete1"), error);
    return NextResponse.json(
      { error: t("items.handlers.delete2") },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const session = await getServerSession(OPTIONS);
    if (!session?.user?.email) {
      return new NextResponse(t("items.handlers.unauthorized"), { status: 401 });
    }

    const json = await request.json();
    const { name, brand, modelNumber, serialNumber, value, description } = json;

    const item = await prisma.item.update({
      where: {
        id: params.itemId,
        userId: (
          await prisma.user.findUnique({ where: { email: session.user.email } })
        )?.id,
      },
      data: {
        name,
        brand,
        modelNumber,
        serialNumber,
        value: typeof value === "string" ? parseFloat(value) : value,
        description,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse(t("items.handlers.error"), { status: 500 });
  }
}
