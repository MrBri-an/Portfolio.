import { requireUser } from "@/lib/auth";
import { marketplaceRepository } from "@/lib/db/marketplace-repository";
import { NewListingForm } from "@/components/marketplace/new-listing-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewListingPage() {
  const user = await requireUser();
  const categories = await marketplaceRepository.listCategories();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <section className="space-y-3">
        <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/10">
          New listing
        </Badge>
        <h1 className="font-[var(--font-jakarta)] text-3xl font-semibold">
          Create a listing
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Build your property post step by step, starting with the right category and your
          saved media quality preference.
        </p>
      </section>

      <Card className="rounded-[28px]">
        <CardHeader>
          <CardTitle>Listing wizard</CardTitle>
        </CardHeader>
        <CardContent>
          <NewListingForm categories={categories} mediaQuality={user.mediaQuality} />
        </CardContent>
      </Card>
    </main>
  );
}
