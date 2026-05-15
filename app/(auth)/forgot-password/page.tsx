import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      description="Request a secure password reset link with a 15-minute expiry."
      asideTitle="Recovery should be quick for real users and expensive for attackers."
      asideText="Password reset requests are rate-limited, reCAPTCHA-protected, and linked to expiring one-time tokens so accounts can be recovered without weakening the platform."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
