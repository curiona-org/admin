import { auth } from "@/lib/auth";
import { AuthProvider } from "@/providers/auth-provider";

export default async function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return <AuthProvider initialSession={session}>{children}</AuthProvider>;
}
