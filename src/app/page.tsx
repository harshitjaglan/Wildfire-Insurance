import { getServerSession } from "next-auth";
import { OPTIONS } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/ui/SignInButton";

export default async function HomePage() {
  const session = await getServerSession(OPTIONS);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Home Inventory</h1>
      <p className="text-xl mb-8">
        Welcome to your home inventory management system
      </p>
      <SignInButton />
    </div>
  );
}
