import { randomUUID } from "crypto";

import { authRepository } from "@/lib/db/auth-repository";
import { marketplaceRepository } from "@/lib/db/marketplace-repository";
import { memoryStore } from "@/lib/db/memory-store";
import { sanitizeText } from "@/lib/security/sanitize";
import type {
  ChatMessage,
  CallLogData,
  ConversationDetail,
  ConversationRecord,
  ConversationSummary,
  MessageRecord,
} from "@/types/marketplace";

const deleteForEveryoneWindowMs = 60 * 60 * 1000;

async function getUserOrThrow(userId: string) {
  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
}

function isParticipant(conversation: ConversationRecord, userId: string) {
  return conversation.starterId === userId || conversation.recipientId === userId;
}

function getOtherUserId(conversation: ConversationRecord, userId: string) {
  return conversation.starterId === userId
    ? conversation.recipientId
    : conversation.starterId;
}

function getVisibleMessages(conversationId: string, userId: string) {
  return memoryStore.messages
    .filter((message) => {
      if (message.conversationId !== conversationId) {
        return false;
      }

      if (message.senderId === userId && message.deletedForSenderAt) {
        return false;
      }

      if (message.recipientId === userId && message.deletedForRecipientAt) {
        return false;
      }

      return true;
    })
    .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime());
}

async function mapMessage(message: MessageRecord): Promise<ChatMessage> {
  const [sender, recipient] = await Promise.all([
    getUserOrThrow(message.senderId),
    getUserOrThrow(message.recipientId),
  ]);

  return {
    ...message,
    sender,
    recipient,
    body: message.deletedForEveryoneAt ? "This message was deleted." : message.body,
    canDeleteForEveryone:
      !message.deletedForEveryoneAt &&
      Date.now() - message.createdAt.getTime() <= deleteForEveryoneWindowMs,
  };
}

async function mapCall(call: {
  id: string;
  conversationId: string;
  callerId: string;
  recipientId: string;
  type: "AUDIO" | "VIDEO";
  status: "MISSED" | "DECLINED" | "COMPLETED";
  startedAt: Date;
  endedAt: Date | null;
}, viewerId: string): Promise<CallLogData> {
  const [caller, recipient] = await Promise.all([
    getUserOrThrow(call.callerId),
    getUserOrThrow(call.recipientId),
  ]);

  return {
    ...call,
    caller,
    recipient,
    direction: call.callerId === viewerId ? "outgoing" : "incoming",
  };
}

function isBlockedBetween(userAId: string, userBId: string) {
  return memoryStore.userBlocks.some(
    (block) =>
      (block.blockerId === userAId && block.blockedId === userBId) ||
      (block.blockerId === userBId && block.blockedId === userAId),
  );
}

async function mapConversation(
  conversation: ConversationRecord,
  userId: string,
): Promise<ConversationSummary> {
  const otherUserId = getOtherUserId(conversation, userId);
  const [otherUser, listing] = await Promise.all([
    getUserOrThrow(otherUserId),
    conversation.listingId
      ? marketplaceRepository.getListingById(conversation.listingId, userId)
      : Promise.resolve(null),
  ]);
  const messages = getVisibleMessages(conversation.id, userId);
  const last = messages[messages.length - 1] ?? null;
  const unreadCount = messages.filter(
    (message) => message.recipientId === userId && !message.seenAt,
  ).length;

  return {
    id: conversation.id,
    otherUser,
    listing,
    lastMessage: last ? await mapMessage(last) : null,
    unreadCount,
    isBlocked: isBlockedBetween(userId, otherUserId),
    updatedAt: conversation.updatedAt,
  };
}

function findConversation(input: {
  currentUserId: string;
  otherUserId: string;
  listingId?: string | null;
}) {
  return memoryStore.conversations.find((conversation) => {
    const samePair =
      (conversation.starterId === input.currentUserId &&
        conversation.recipientId === input.otherUserId) ||
      (conversation.starterId === input.otherUserId &&
        conversation.recipientId === input.currentUserId);

    return samePair && (input.listingId ? conversation.listingId === input.listingId : true);
  });
}

function createConversation(input: {
  currentUserId: string;
  otherUserId: string;
  listingId?: string | null;
}) {
  const now = new Date();
  const conversation: ConversationRecord = {
    id: randomUUID(),
    starterId: input.currentUserId,
    recipientId: input.otherUserId,
    listingId: input.listingId ?? null,
    createdAt: now,
    updatedAt: now,
  };

  memoryStore.conversations.push(conversation);
  memoryStore.conversationParticipants.push(
    {
      id: randomUUID(),
      conversationId: conversation.id,
      userId: input.currentUserId,
      archivedAt: null,
      mutedAt: null,
      createdAt: now,
    },
    {
      id: randomUUID(),
      conversationId: conversation.id,
      userId: input.otherUserId,
      archivedAt: null,
      mutedAt: null,
      createdAt: now,
    },
  );

  return conversation;
}

export const chatRepository = {
  async listConversations(userId: string) {
    const conversations = memoryStore.conversations
      .filter((conversation) => isParticipant(conversation, userId))
      .sort((left, right) => right.updatedAt.getTime() - left.updatedAt.getTime());

    return Promise.all(conversations.map((conversation) => mapConversation(conversation, userId)));
  },

  async getUnreadCount(userId: string) {
    return memoryStore.messages.filter(
      (message) => message.recipientId === userId && !message.seenAt,
    ).length;
  },

  async getOrCreateConversation(input: {
    currentUserId: string;
    otherUserId: string;
    listingId?: string | null;
  }) {
    if (input.currentUserId === input.otherUserId) {
      throw new Error("You cannot start a chat with yourself.");
    }

    const otherUser = await authRepository.findUserById(input.otherUserId);

    if (!otherUser) {
      throw new Error("User not found.");
    }

    return (
      findConversation(input) ??
      createConversation(input)
    );
  },

  async getConversation(conversationId: string, userId: string): Promise<ConversationDetail | null> {
    const conversation = memoryStore.conversations.find((entry) => entry.id === conversationId);

    if (!conversation || !isParticipant(conversation, userId)) {
      return null;
    }

    const summary = await mapConversation(conversation, userId);
    const messages = await Promise.all(
      getVisibleMessages(conversation.id, userId).map((message) => mapMessage(message)),
    );
    const calls = await Promise.all(
      memoryStore.callLogs
        .filter((call) => call.conversationId === conversation.id)
        .sort((left, right) => left.startedAt.getTime() - right.startedAt.getTime())
        .map((call) => mapCall(call, userId)),
    );

    return {
      ...summary,
      messages,
      calls,
    };
  },

  async sendMessage(input: {
    conversationId: string;
    senderId: string;
    body: string;
    mediaUrl?: string | null;
    mediaMimeType?: string | null;
    mediaName?: string | null;
    kind?: MessageRecord["kind"];
  }) {
    const conversation = memoryStore.conversations.find(
      (entry) => entry.id === input.conversationId,
    );

    if (!conversation || !isParticipant(conversation, input.senderId)) {
      throw new Error("Conversation not found.");
    }

    const recipientId = getOtherUserId(conversation, input.senderId);

    if (isBlockedBetween(input.senderId, recipientId)) {
      throw new Error("This chat is blocked.");
    }

    const now = new Date();
    const message: MessageRecord = {
      id: randomUUID(),
      conversationId: conversation.id,
      listingId: conversation.listingId,
      senderId: input.senderId,
      recipientId,
      kind: input.kind ?? (input.mediaUrl ? "MEDIA" : "TEXT"),
      body: sanitizeText(input.body),
      mediaUrl: input.mediaUrl ?? null,
      mediaMimeType: input.mediaMimeType ?? null,
      mediaName: input.mediaName ?? null,
      deliveredAt: now,
      seenAt: null,
      deletedForEveryoneAt: null,
      deletedForSenderAt: null,
      deletedForRecipientAt: null,
      createdAt: now,
    };

    memoryStore.messages.push(message);
    conversation.updatedAt = now;

    return mapMessage(message);
  },

  async markRead(conversationId: string, userId: string) {
    const conversation = memoryStore.conversations.find((entry) => entry.id === conversationId);

    if (!conversation || !isParticipant(conversation, userId)) {
      return false;
    }

    const now = new Date();
    memoryStore.messages.forEach((message) => {
      if (message.conversationId === conversationId && message.recipientId === userId) {
        message.seenAt = message.seenAt ?? now;
      }
    });

    const existing = memoryStore.messageReads.find(
      (read) => read.conversationId === conversationId && read.userId === userId,
    );

    if (existing) {
      existing.readAt = now;
    } else {
      memoryStore.messageReads.push({
        id: randomUUID(),
        conversationId,
        userId,
        readAt: now,
      });
    }

    return true;
  },

  async deleteMessage(input: {
    messageId: string;
    userId: string;
    mode: "me" | "everyone";
  }) {
    const message = memoryStore.messages.find((entry) => entry.id === input.messageId);

    if (!message || (message.senderId !== input.userId && message.recipientId !== input.userId)) {
      throw new Error("Message not found.");
    }

    const now = new Date();

    if (input.mode === "everyone") {
      if (message.senderId !== input.userId) {
        throw new Error("Only the sender can delete this message for everyone.");
      }

      if (now.getTime() - message.createdAt.getTime() > deleteForEveryoneWindowMs) {
        throw new Error("Messages can only be deleted for everyone within 1 hour.");
      }

      message.deletedForEveryoneAt = now;
      return true;
    }

    if (message.senderId === input.userId) {
      message.deletedForSenderAt = now;
    } else {
      message.deletedForRecipientAt = now;
    }

    return true;
  },

  async blockUser(input: { blockerId: string; blockedId: string; reason?: string | null }) {
    if (input.blockerId === input.blockedId) {
      throw new Error("You cannot block yourself.");
    }

    const existing = memoryStore.userBlocks.find(
      (block) => block.blockerId === input.blockerId && block.blockedId === input.blockedId,
    );

    if (existing) {
      return existing;
    }

    const block = {
      id: randomUUID(),
      blockerId: input.blockerId,
      blockedId: input.blockedId,
      reason: input.reason ?? null,
      createdAt: new Date(),
    };

    memoryStore.userBlocks.push(block);
    return block;
  },

  async reportUser(input: {
    reporterId: string;
    reportedId: string;
    reason: string;
    listingId?: string | null;
    messageId?: string | null;
  }) {
    const report = {
      id: randomUUID(),
      reporterId: input.reporterId,
      reportedId: input.reportedId,
      reason: sanitizeText(input.reason),
      listingId: input.listingId ?? null,
      messageId: input.messageId ?? null,
      status: "PENDING" as const,
      createdAt: new Date(),
    };

    memoryStore.userReports.push(report);
    return report;
  },

  async startCall(input: {
    conversationId: string;
    callerId: string;
    type: "AUDIO" | "VIDEO";
  }) {
    const conversation = memoryStore.conversations.find(
      (entry) => entry.id === input.conversationId,
    );

    if (!conversation || !isParticipant(conversation, input.callerId)) {
      throw new Error("Conversation not found.");
    }

    const recipientId = getOtherUserId(conversation, input.callerId);

    if (isBlockedBetween(input.callerId, recipientId)) {
      throw new Error("This chat is blocked.");
    }

    const now = new Date();
    const call = {
      id: randomUUID(),
      conversationId: conversation.id,
      callerId: input.callerId,
      recipientId,
      type: input.type,
      status: "MISSED" as const,
      startedAt: now,
      endedAt: null,
    };

    memoryStore.callLogs.push(call);
    conversation.updatedAt = now;

    const message: MessageRecord = {
      id: randomUUID(),
      conversationId: conversation.id,
      listingId: conversation.listingId,
      senderId: input.callerId,
      recipientId,
      kind: "CALL",
      body: `${input.type === "VIDEO" ? "Video" : "Audio"} call started`,
      mediaUrl: null,
      mediaMimeType: null,
      mediaName: null,
      deliveredAt: now,
      seenAt: null,
      deletedForEveryoneAt: null,
      deletedForSenderAt: null,
      deletedForRecipientAt: null,
      createdAt: now,
    };

    memoryStore.messages.push(message);

    return mapCall(call, input.callerId);
  },

  async endCall(input: {
    callId: string;
    userId: string;
    status: "MISSED" | "DECLINED" | "COMPLETED";
  }) {
    const call = memoryStore.callLogs.find((entry) => entry.id === input.callId);

    if (!call || (call.callerId !== input.userId && call.recipientId !== input.userId)) {
      throw new Error("Call not found.");
    }

    call.status = input.status;
    call.endedAt = new Date();

    return mapCall(call, input.userId);
  },
};
