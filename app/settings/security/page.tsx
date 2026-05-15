import { requireUser } from "@/lib/auth";
import { SecuritySettings } from "@/components/auth/security-settings";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SecuritySettingsPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <section className="space-y-3">
        <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
          Security
        </Badge>
        <h1 className="font-[var(--font-jakarta)] text-3xl font-semibold">
          Account protection settings
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Keep your account ready for messaging, listings, and future marketplace actions by
          hardening how you sign in.
        </p>
      </section>

      <SecuritySettings user={user} />

      <Card className="rounded-[28px]">
        <CardHeader>
          <CardTitle>Verified contact summary</CardTitle>
          <CardDescription>
            These are the contact points currently available for security workflows.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="mt-2 font-medium">{user.email || "Not added yet"}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {user.emailVerifiedAt ? "Verified" : "Not verified"}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-muted/40 p-4">
            <p className="text-sm text-muted-foreground">Phone</p>
            <p className="mt-2 font-medium">{user.phone || "Not added yet"}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {user.phoneVerifiedAt ? "Verified" : "Not verified"}
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
