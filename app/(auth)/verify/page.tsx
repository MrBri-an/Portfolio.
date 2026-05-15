import { AuthShell } from "@/components/auth/auth-shell";
import { VerifyForm } from "@/components/auth/verify-form";

type VerifyPageProps = {
  searchParams: Promise<{
    identifier?: string;
    purpose?: "REGISTER" | "LOGIN_2FA";
    debugCode?: string;
  }>;
};

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const params = await searchParams;

  return (
    <AuthShell
      title="Enter your verification code"
      description="Use the one-time code sent to your chosen email address or phone number."
      asideTitle="Verification links the account to a real, reachable person."
      asideText="That matters for safer conversations, fewer fake listings, and a cleaner foundation for account recovery and moderation."
    >
      <VerifyForm
        identifier={params.identifier || ""}
        purpose={params.purpose || "REGISTER"}
        debugCode={params.debugCode}
      />
    </AuthShell>
  );
}
