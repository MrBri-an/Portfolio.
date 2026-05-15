import { requireUser } from "@/lib/auth";
import { ProfileMediaSettings } from "@/components/settings/profile-media-settings";
import { Badge } from "@/components/ui/badge";

export default async function ProfileMediaSettingsPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <section className="space-y-3">
        <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
          Profile & Media
        </Badge>
        <h1 className="font-[var(--font-jakarta)] text-3xl font-semibold">
          Profile look, links, and media quality
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Adjust how NestFind optimizes your uploads and how your public profile presents
          itself to renters and buyers.
        </p>
      </section>

      <ProfileMediaSettings user={user} />
    </main>
  );
}
