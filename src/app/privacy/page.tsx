import { getServerSession } from "next-auth";
import { OPTIONS } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function PrivacyPolicy() {
  const session = await getServerSession(OPTIONS);

  if (!session?.user?.email) {
    redirect("/");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Data Protection</h2>
        <ul className="space-y-3">
          <li>
            • Your inventory data is encrypted at rest using industry-standard
            encryption
          </li>
          <li>• All data transfers are secured with SSL/TLS encryption</li>
          <li>• We never share your personal information with third parties</li>
          <li>• You can request deletion of your data at any time</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Authentication</h2>
        <p>We use Google OAuth 2.0 for secure authentication, meaning:</p>
        <ul className="space-y-3 mt-2">
          <li>• We never see or store your password</li>
          <li>• Two-factor authentication is supported</li>
          <li>
            • You can revoke access at any time through your Google account
          </li>
        </ul>
      </section>
    </div>
  );
}
