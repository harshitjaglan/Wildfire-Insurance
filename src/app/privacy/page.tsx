import { getServerSession } from "next-auth";
import { OPTIONS } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { t } from "../../i18n";

export default async function PrivacyPolicy() {
     const session = await getServerSession(OPTIONS);

     if (!session?.user?.email) {
          redirect("/");
          return null;
     }

     return (
          <div className="max-w-4xl mx-auto py-8 px-4">
               <h1 className="text-3xl font-bold mb-6">
                    {t("privacy.headers.privacy")}
               </h1>

               <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                         {t("privacy.headers.data")}
                    </h2>
                    <ul className="space-y-3">
                         <li className="whitespace-pre-line">
                              {t("privacy.paragraphs.p1")}
                         </li>
                         <li>{t("privacy.paragraphs.p2")}</li>
                         <li>{t("privacy.paragraphs.p3")}</li>
                         <li>{t("privacy.paragraphs.p4")}</li>
                    </ul>
               </section>

               <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                         {t("privacy.headers.auth")}
                    </h2>
                    <p>{t("privacy.paragraphs.p5")}</p>
                    <ul className="space-y-3 mt-2">
                         <li>{t("privacy.paragraphs.p6")}</li>
                         <li>{t("privacy.paragraphs.p7")}</li>
                         <li>{t("privacy.paragraphs.p8")}</li>
                    </ul>
               </section>
          </div>
     );
}
