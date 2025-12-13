import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RoomClient } from "@/app/rooms/[roomId]/client";
import { t } from "../../../i18n";

export default async function RoomItemsPage({
  params: { roomId },
}: {
  params: { roomId: string };
}) {
  const session = await getServerSession(OPTIONS);

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/");
  }

  const membership = await prisma.roomMembership.findFirst({
    where: {
      roomId,
      userId: user.id,
    },
    include: {
      room: {
        include: {
          items: true,
        },
      },
    },
  });

  const ClientLabels = {
      add1: t("roomIdClient.headers.add"),
      update: t("roomIdClient.handlers.update"),
      negative: t("roomIdClient.handlers.negative"),
      network: t("roomIdClient.handlers.network"),
      add2: t("roomIdClient.handlers.add"),
      delete1: t("roomIdClient.handlers.delete1"),
      delete2: t("roomIdClient.handlers.delete2"),
      delete3: t("roomIdClient.handlers.delete3"),
      back: t("roomIdClient.link.back"),
      edit1: t("roomIdClient.link.edit"),
      save: t("roomIdClient.buttons.save"),
      cancel: t("roomIdClient.buttons.cancel"),
      edit2: t("roomIdClient.buttons.edit"),
      add3: t("roomIdClient.buttons.add"),
      delete4: t("roomIdClient.buttons.delete"),
  };

  if (!membership) {
    redirect("/rooms");
  }

  return <RoomClient room={membership.room} userId={user.id} labels={ClientLabels} />;
}
