import { z } from "zod";

export const startConversationSchema = z.object({
  otherUserId: z.string().trim().min(1),
  listingId: z.string().trim().optional().nullable(),
});

export const sendMessageSchema = z.object({
  body: z.string().trim().max(5000).default(""),
  mediaUrl: z.url().optional().nullable(),
  mediaMimeType: z.string().trim().max(120).optional().nullable(),
  mediaName: z.string().trim().max(180).optional().nullable(),
  kind: z.enum(["TEXT", "MEDIA", "VOICE"]).default("TEXT"),
}).refine((data) => Boolean(data.body || data.mediaUrl), {
  message: "Type a message or attach media.",
  path: ["body"],
});

export const deleteMessageSchema = z.object({
  mode: z.enum(["me", "everyone"]),
});

export const blockUserSchema = z.object({
  userId: z.string().trim().min(1),
  reason: z.string().trim().max(500).optional().nullable(),
});

export const reportUserSchema = z.object({
  userId: z.string().trim().min(1),
  reason: z.string().trim().min(8).max(1000),
  listingId: z.string().trim().optional().nullable(),
  messageId: z.string().trim().optional().nullable(),
});

export const startCallSchema = z.object({
  type: z.enum(["AUDIO", "VIDEO"]),
});

export const endCallSchema = z.object({
  status: z.enum(["MISSED", "DECLINED", "COMPLETED"]).default("COMPLETED"),
});
