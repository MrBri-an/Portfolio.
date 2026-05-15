"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mediaQualityOptions } from "@/lib/marketplace";
import type { SessionUser } from "@/types/auth";

type ProfileMediaSettingsProps = {
  user: SessionUser;
};

export function ProfileMediaSettings({ user }: ProfileMediaSettingsProps) {
  const [form, setForm] = useState({
    mediaQuality: user.mediaQuality,
    bannerImageUrl: user.bannerImageUrl || "",
    bio: user.bio || "",
    whatsappUrl: user.whatsappUrl || "",
    instagramUrl: user.instagramUrl || "",
    linkedinUrl: user.linkedinUrl || "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <Card className="rounded-[28px]">
      <CardHeader>
        <CardTitle>Profile and media preferences</CardTitle>
        <CardDescription>
          Control how your media is optimized and how your public profile appears.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Media Upload Quality</Label>
          <div className="grid gap-3 md:grid-cols-3">
            {mediaQualityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`rounded-2xl border p-4 text-left transition ${
                  form.mediaQuality === option.value
                    ? "border-primary bg-primary/10"
                    : "border-border bg-background"
                }`}
                onClick={() =>
                  setForm((current) => ({ ...current, mediaQuality: option.value }))
                }
              >
                <p className="font-medium">{option.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{option.description}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-primary">
                  {option.cloudinaryQuality}
                </p>
              </button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Current quality:{" "}
            <span className="font-medium capitalize text-foreground">{form.mediaQuality}</span>
          </p>
        </div>

        <div className="grid gap-5">
          <div className="space-y-2">
            <Label htmlFor="bannerImageUrl">Banner image URL</Label>
            <Input
              id="bannerImageUrl"
              value={form.bannerImageUrl}
              onChange={(event) =>
                setForm((current) => ({ ...current, bannerImageUrl: event.target.value }))
              }
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              maxLength={200}
              value={form.bio}
              onChange={(event) =>
                setForm((current) => ({ ...current, bio: event.target.value }))
              }
              placeholder="Tell people what kind of homes or locations you focus on."
            />
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="whatsappUrl">WhatsApp link</Label>
              <Input
                id="whatsappUrl"
                value={form.whatsappUrl}
                onChange={(event) =>
                  setForm((current) => ({ ...current, whatsappUrl: event.target.value }))
                }
                placeholder="https://wa.me/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagramUrl">Instagram</Label>
              <Input
                id="instagramUrl"
                value={form.instagramUrl}
                onChange={(event) =>
                  setForm((current) => ({ ...current, instagramUrl: event.target.value }))
                }
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn</Label>
              <Input
                id="linkedinUrl"
                value={form.linkedinUrl}
                onChange={(event) =>
                  setForm((current) => ({ ...current, linkedinUrl: event.target.value }))
                }
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
        </div>

        {message ? <p className="text-sm text-emerald-600">{message}</p> : null}

        <Button
          type="button"
          className="rounded-full"
          disabled={isPending}
          onClick={() => {
            setMessage(null);
            startTransition(async () => {
              const response = await fetch("/api/settings/profile-media", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
              });

              const data = (await response.json()) as { message?: string };

              if (response.ok) {
                setMessage(data.message || "Profile preferences updated.");
              }
            });
          }}
        >
          {isPending ? "Saving..." : "Save preferences"}
        </Button>
      </CardContent>
    </Card>
  );
}
