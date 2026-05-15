import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

type ResetPasswordPageProps = {
  searchParams: {
    token?: string;
  };
};

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  return (
    <AuthShell
      title="Choose a new password"
      description="Set a fresh password for your NestFind account using the secure reset link you received."
      asideTitle="Short-lived reset tokens limit the blast radius."
      asideText="Reset links expire after 15 minutes and are consumed once, which reduces the risk of stale links being reused if they are exposed."
    >
      <ResetPasswordForm token={searchParams.token || ""} />
    </AuthShell>
  );
}
