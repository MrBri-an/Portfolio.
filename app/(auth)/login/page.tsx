import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in with your verified email or phone number. If 2FA is enabled, we’ll confirm it with a fresh OTP."
      asideTitle="Sessions are short on exposure and long on protection."
      asideText="NestFind uses HTTP-only JWT cookies, route-level security checks, and revocable session records so we can safely support future features like chat, calls, and device activity logs."
    >
      <LoginForm />
    </AuthShell>
  );
}
