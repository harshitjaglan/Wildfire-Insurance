
import { getServerSession } from "next-auth";
import { OPTIONS } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RoomsClient } from "./client";
import { t } from "../../i18n";

export default async function RoomsPage() {
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

  const memberships = await prisma.roomMembership.findMany({
    where: { userId: user.id },
    include: {
      room: {
        include: {
          items: true,
        },
      },
    },
  });

  const ClientLabels = {
      rooms: t("roomsClient.headers.rooms"),
      items: t("roomsClient.headers.items"),
      roomFail1: t("roomsClient.handlers.roomFail1"),
      roomFail2: t("roomsClient.handlers.roomFail2"),
      room1: t("roomsClient.paragraphs.room"),
      add1: t("roomsClient.paragraphs.add"),
      no: t("roomsClient.paragraphs.no"),
      more: t("roomsClient.paragraphs.more"),
      placeholder: t("roomsClient.paragraphs.placeholder"),
      name: t("roomsClient.form.name"),
      cancel: t("roomsClient.form.cancel"),
      create: t("roomsClient.form.create"),
      room2: t("roomsClient.buttons.room"),
      add2: t("roomsClient.buttons.add"),
  };

  const rooms = memberships.map((m) => m.room);

  return <RoomsClient user={{ id: user.id, rooms }} labels={ClientLabels}/>;
}
