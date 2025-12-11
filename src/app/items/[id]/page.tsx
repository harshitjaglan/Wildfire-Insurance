import { prisma } from "@/lib/prisma";
import { ItemForm } from "@/app/items/[id]/ItemForm";
import { notFound, redirect } from "next/navigation";
import { t } from "../../../i18n";

export default async function ItemPage({ params }: { params: { id: string } }) {
  const item = await prisma.item.findUnique({
    where: {
      id: params.id,
    },
    include: {
      room: true,
    },
  });

  const ClientLabels = {
    update1: t("itemForm.handlers.update1"),
    update2: t("itemForm.handlers.update2"),
    error: t("itemForm.handlers.error"),
    proTip: t("itemForm.paragraphs.proTip"),
    brand1: t("itemForm.paragraphs.brand"),
    important: t("itemForm.paragraphs.important"),
    helps: t("itemForm.paragraphs.helps"),
    include: t("itemForm.paragraphs.include"),
    proof: t("itemForm.paragraphs.proof"),
    name: t("itemForm.label.name"),
    brand2: t("itemForm.label.brand"),
    model: t("itemForm.label.model"),
    serial: t("itemForm.label.serial"),
    purchase: t("itemForm.label.purchase"),
    detail: t("itemForm.label.detail"),
    photos: t("itemForm.label.photos"),
    save: t("itemForm.buttons.save"),
  };

  if (!item) {
    redirect("/items");
  }

  return <ItemForm initialItem={item} labels={ClientLabels}/>;
}
