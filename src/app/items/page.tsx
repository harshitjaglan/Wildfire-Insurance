import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AllItemsClient } from "./client";
import { t } from "../../i18n";

export default async function AllItemsPage() {
  const session = await getServerSession(OPTIONS);

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const ClientLabels = {
      allItems: t("itemsClient.headers.allItems"),
      totalValue: t("itemsClient.div.totalValue"),
      generate: t("itemsClient.buttons.generate"),
      addBrand: t("itemsClient.link.addBrand"),
      addModel: t("itemsClient.link.addModel"),
      addSerial: t("itemsClient.link.addSerial"),
      generate1: t("itemsClient.handlers.generate1"),
      generate2: t("itemsClient.handlers.generate2"),
      generate3: t("itemsClient.handlers.generate3"),
  };

  if (!user) {
    redirect("/");
  }

  // Get all items across all rooms
  const items = await prisma.item.findMany({
    where: {
      room: {
        userId: user.id,
      },
    },
    include: {
      room: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <AllItemsClient items={items} labels={ClientLabels} />;
}
