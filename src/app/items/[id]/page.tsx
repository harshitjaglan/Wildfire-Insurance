import { prisma } from "@/lib/prisma";
import { ItemForm } from "@/app/items/[id]/ItemForm";
import { notFound, redirect } from "next/navigation";

export default async function ItemPage({ params }: { params: { id: string } }) {
  const item = await prisma.item.findUnique({
    where: {
      id: params.id,
    },
    include: {
      room: true,
    },
  });

  if (!item) {
    redirect("/items");
  }

  return <ItemForm initialItem={item} />;
}
