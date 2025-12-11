import { getServerSession } from "next-auth";
import { OPTIONS } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/app/profile/ProfileForm";
import { t } from "../../i18n";

export default async function ProfilePage() {
  const session = await getServerSession(OPTIONS);

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const ClientLabels = {
      settings: t("profile.headers.settings"),
      picture: t("profile.headers.picture"),
      danger: t("profile.headers.danger"),
      updatePfp1: t("profile.handlers.updatePfp1"),
      updatePfp2: t("profile.handlers.updatePfp2"),
      deleteConfirm: t("profile.handlers.deleteConfirm"),
      deleteFail1: t("profile.handlers.deleteFail1"),
      deleteFail2: t("profile.handlers.deleteFail2"),
      error: t("profile.handlers.error"),
      success: t("profile.paragraphs.success"),
      update: t("profile.paragraphs.update"),
      delete1: t("profile.paragraphs.delete"),
      display: t("profile.form.display"),
      email: t("profile.form.email"),
      save: t("profile.form.save"),
      delete2: t("profile.buttons.delete"),
  };

  if (!user) {
    redirect("/");
  }

  return <ProfileForm user={user} labels={ClientLabels} />;
}
