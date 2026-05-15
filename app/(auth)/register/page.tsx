import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your NestFind account"
      description="Start with a secure email or phone registration flow, then verify your account with OTP."
      asideTitle="Trusted onboarding for a trust-sensitive marketplace."
      asideText="NestFind treats account security as product infrastructure, not an afterthought. This first phase is focused on identity, verification, and safe session handling."
    >
      <RegisterForm />
    </AuthShell>
  );
}
