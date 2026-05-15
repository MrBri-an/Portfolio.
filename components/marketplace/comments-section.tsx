"use client";

import { Flag, Heart, Send, Trash2 } from "lucide-react";
import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import type { CommentThread } from "@/types/marketplace";

type CommentsSectionProps = {
  listingId: string;
  comments: CommentThread[];
  canComment: boolean;
};

export function CommentsSection({
  listingId,
  comments: initialComments,
  canComment,
}: CommentsSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [isPending, startTransition] = useTransition();

  const visibleComments = useMemo(
    () => comments.slice(0, visibleCount),
    [comments, visibleCount],
  );

  async function submitComment(parentId?: string) {
    startTransition(async () => {
      const response = await fetch(`/api/listings/${listingId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body,
          parentId: parentId ?? null,
        }),
      });

      const data = (await response.json()) as { comments?: CommentThread[] };

      if (response.ok && data.comments) {
        setComments(data.comments);
        setBody("");
      }
    });
  }

  return (
    <section className="space-y-5 rounded-[28px] border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Comments</h2>
          <p className="text-sm text-muted-foreground">
            Ask questions, leave helpful notes, or reply directly to listing details.
          </p>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
          {comments.length} total
        </span>
      </div>

      {canComment ? (
        <div className="space-y-3">
          <Textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            maxLength={500}
            placeholder="Write a comment about this listing..."
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{body.length}/500</p>
            <Button
              type="button"
              className="rounded-full"
              disabled={!body.trim() || isPending}
              onClick={() => submitComment()}
            >
              <Send className="mr-2 h-4 w-4" />
              {isPending ? "Posting..." : "Post comment"}
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Sign in to join the discussion.</p>
      )}

      <div className="space-y-4">
        {visibleComments.map((comment) => (
          <div key={comment.id} className="space-y-3 rounded-2xl border border-border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{comment.author.fullName}</p>
                <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="inline-flex items-center gap-1 text-sm">
                  <Heart className="h-4 w-4" />
                  {comment.likesCount}
                </span>
                <Flag className="h-4 w-4" />
                <Trash2 className="h-4 w-4" />
              </div>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              {comment.deletedAt ? "This comment was deleted." : comment.body}
            </p>
            {comment.replies.length ? (
              <div className="space-y-3 border-l border-border pl-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="rounded-2xl bg-muted/40 p-4">
                    <p className="font-medium">{reply.author.fullName}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{reply.body}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {comments.length > visibleCount ? (
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={() => setVisibleCount((count) => count + 10)}
        >
          Load more
        </Button>
      ) : null}
    </section>
  );
}
