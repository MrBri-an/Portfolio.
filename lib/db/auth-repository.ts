import { randomUUID } from "crypto";

import {
  TwoFactorChannel as PrismaTwoFactorChannel,
  type ActiveSession,
  type User,
} from "@prisma/client";

import { env } from "@/lib/env";
import {
  memoryStore,
  type StoredSession,
  type StoredUser,
} from "@/lib/db/memory-store";
import { prisma } from "@/lib/db/prisma";
import {
  generateOtpCode,
  generateOpaqueToken,
  generateProfileId,
  hashValue,
} from "@/lib/security/otp";
import {
  normalizeEmail,
  normalizeIdentifier,
  normalizePhone,
} from "@/lib/security/sanitize";
import type {
  AuthUser,
  SessionUser,
  TwoFactorChannel,
  VerificationChannel,
  VerificationPurpose,
} from "@/types/auth";

let prismaAvailable = Boolean(env.databaseUrl);

function toAuthUser(user: User | StoredUser): AuthUser {
  return {
    id: user.id,
    profileId: user.profileId,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    phone: user.phone,
    imageUrl: user.imageUrl,
    bannerImageUrl: user.bannerImageUrl,
    bio: user.bio,
    whatsappUrl: user.whatsappUrl,
    instagramUrl: user.instagramUrl,
    linkedinUrl: user.linkedinUrl,
    mediaQuality: user.mediaQuality,
    emailVisibility: user.emailVisibility,
    phoneVisibility: user.phoneVisibility,
    emailVerifiedAt: user.emailVerifiedAt,
    phoneVerifiedAt: user.phoneVerifiedAt,
    isTwoFactorEnabled: user.isTwoFactorEnabled,
    twoFactorChannel: user.twoFactorChannel,
    verificationBadge: user.verificationBadge,
    createdAt: user.createdAt,
  };
}

function getPrimaryIdentifier(user: Pick<StoredUser, "email" | "phone">) {
  return user.phone ?? user.email ?? "";
}

async function safely<T>(callback: () => Promise<T>) {
  if (!prismaAvailable) {
    return null;
  }

  try {
    return await callback();
  } catch {
    prismaAvailable = false;
    return null;
  }
}

function mapStoredSession(
  session: ActiveSession | StoredSession,
  user: User | StoredUser,
): SessionUser {
  return {
    ...toAuthUser(user),
    sessionId: session.jti,
  };
}

export const authRepository = {
  async findUserByIdentifier(identifier: string) {
    const normalized = normalizeIdentifier(identifier);

    const prismaUser = await safely(() =>
      prisma.user.findFirst({
        where: {
          OR: [{ email: normalized }, { phone: normalized }],
          deletedAt: null,
        },
      }),
    );

    if (prismaUser) {
      return toAuthUser(prismaUser);
    }

    const user = memoryStore.users.find(
      (entry) =>
        !entry.deletedAt &&
        (entry.email === normalized || entry.phone === normalized),
    );

    return user ? toAuthUser(user) : null;
  },

  async findUserRecordByIdentifier(identifier: string) {
    const normalized = normalizeIdentifier(identifier);

    const prismaUser = await safely(() =>
      prisma.user.findFirst({
        where: {
          OR: [{ email: normalized }, { phone: normalized }],
          deletedAt: null,
        },
      }),
    );

    if (prismaUser) {
      return prismaUser;
    }

    return (
      memoryStore.users.find(
        (entry) =>
          !entry.deletedAt &&
          (entry.email === normalized || entry.phone === normalized),
      ) ?? null
    );
  },

  async findUserById(userId: string) {
    const prismaUser = await safely(() =>
      prisma.user.findUnique({
        where: { id: userId },
      }),
    );

    if (prismaUser && !prismaUser.deletedAt) {
      return toAuthUser(prismaUser);
    }

    const user = memoryStore.users.find(
      (entry) => entry.id === userId && !entry.deletedAt,
    );

    return user ? toAuthUser(user) : null;
  },

  async findUserRecordById(userId: string) {
    const prismaUser = await safely(() =>
      prisma.user.findUnique({
        where: { id: userId },
      }),
    );

    if (prismaUser) {
      return prismaUser;
    }

    return memoryStore.users.find((entry) => entry.id === userId) ?? null;
  },

  async findUserByGoogleId(googleId: string) {
    const prismaUser = await safely(() =>
      prisma.user.findUnique({
        where: { googleId },
      }),
    );

    if (prismaUser && !prismaUser.deletedAt) {
      return toAuthUser(prismaUser);
    }

    const user = memoryStore.users.find(
      (entry) => entry.googleId === googleId && !entry.deletedAt,
    );

    return user ? toAuthUser(user) : null;
  },

  async createUser(input: {
    fullName: string;
    username?: string | null;
    email?: string | null;
    phone?: string | null;
    passwordHash?: string | null;
    googleId?: string | null;
    emailVerifiedAt?: Date | null;
    phoneVerifiedAt?: Date | null;
  }) {
    const fallbackTwoFactorChannel: TwoFactorChannel = input.phone
      ? "PHONE"
      : "EMAIL";

    const data = {
      profileId: generateProfileId(),
      fullName: input.fullName,
      username: input.username || null,
      email: normalizeEmail(input.email),
      phone: normalizePhone(input.phone),
      passwordHash: input.passwordHash ?? null,
      googleId: input.googleId ?? null,
      emailVerifiedAt: input.emailVerifiedAt ?? null,
      phoneVerifiedAt: input.phoneVerifiedAt ?? null,
      mediaQuality: "high" as const,
      emailVisibility: "PRIVATE" as const,
      phoneVisibility: "PRIVATE" as const,
    };

    const prismaUser = await safely(() =>
      prisma.user.create({
        data: {
          ...data,
          bannerImageUrl: null,
          bio: null,
          whatsappUrl: null,
          instagramUrl: null,
          linkedinUrl: null,
          twoFactorChannel: input.phone
            ? PrismaTwoFactorChannel.PHONE
            : PrismaTwoFactorChannel.EMAIL,
        },
      }),
    );

    if (prismaUser) {
      return toAuthUser(prismaUser);
    }

    const now = new Date();
    const user: StoredUser = {
      id: randomUUID(),
      profileId: data.profileId,
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      phone: data.phone,
      passwordHash: data.passwordHash,
      googleId: data.googleId,
      imageUrl: null,
      bannerImageUrl: null,
      bio: null,
      whatsappUrl: null,
      instagramUrl: null,
      linkedinUrl: null,
      mediaQuality: data.mediaQuality,
      emailVisibility: data.emailVisibility,
      phoneVisibility: data.phoneVisibility,
      emailVerifiedAt: data.emailVerifiedAt,
      phoneVerifiedAt: data.phoneVerifiedAt,
      verificationBadge: "NONE",
      isTwoFactorEnabled: false,
      twoFactorChannel: fallbackTwoFactorChannel,
      deleteScheduledAt: null,
      deletedAt: null,
      createdAt: now,
    };

    memoryStore.users.push(user);

    return toAuthUser(user);
  },

  async markUserAsVerified(userId: string, channel: VerificationChannel) {
    const verifiedAt =
      channel === "EMAIL"
        ? { emailVerifiedAt: new Date() }
        : { phoneVerifiedAt: new Date() };

    const prismaUser = await safely(() =>
      prisma.user.update({
        where: { id: userId },
        data: verifiedAt,
      }),
    );

    if (prismaUser) {
      return toAuthUser(prismaUser);
    }

    const user = memoryStore.users.find((entry) => entry.id === userId);

    if (!user) {
      return null;
    }

    if (channel === "EMAIL") {
      user.emailVerifiedAt = new Date();
    } else {
      user.phoneVerifiedAt = new Date();
    }

    return toAuthUser(user);
  },

  async createVerificationChallenge(input: {
    userId: string;
    identifier: string;
    channel: VerificationChannel;
    purpose: VerificationPurpose;
    ttlMinutes?: number;
  }) {
    const otpCode = generateOtpCode();
    const linkToken = generateOpaqueToken();
    const expiresAt = new Date(Date.now() + (input.ttlMinutes ?? 15) * 60_000);

    const record = {
      userId: input.userId,
      identifier: normalizeIdentifier(input.identifier),
      channel: input.channel,
      purpose: input.purpose,
      codeHash: hashValue(otpCode),
      linkTokenHash: hashValue(linkToken),
      expiresAt,
    };

    const prismaToken = await safely(() =>
      prisma.verificationToken.create({
        data: record,
      }),
    );

    if (!prismaToken) {
      memoryStore.tokens.push({
        id: randomUUID(),
        ...record,
        consumedAt: null,
        createdAt: new Date(),
      });
    }

    return {
      code: otpCode,
      linkToken,
      expiresAt,
    };
  },

  async consumeVerificationCode(input: {
    identifier: string;
    purpose: VerificationPurpose;
    code: string;
  }) {
    const identifier = normalizeIdentifier(input.identifier);
    const codeHash = hashValue(input.code);

    const prismaToken = await safely(() =>
      prisma.verificationToken.findFirst({
        where: {
          identifier,
          purpose: input.purpose,
          codeHash,
          consumedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    );

    if (prismaToken) {
      await prisma.verificationToken.update({
        where: { id: prismaToken.id },
        data: { consumedAt: new Date() },
      });

      return prismaToken;
    }

    const token = [...memoryStore.tokens]
      .reverse()
      .find(
        (entry) =>
          entry.identifier === identifier &&
          entry.purpose === input.purpose &&
          !entry.consumedAt &&
          entry.expiresAt > new Date() &&
          entry.codeHash === codeHash,
      );

    if (!token) {
      return null;
    }

    token.consumedAt = new Date();
    return token;
  },

  async consumeResetToken(token: string) {
    const tokenHash = hashValue(token);

    const prismaToken = await safely(() =>
      prisma.verificationToken.findFirst({
        where: {
          purpose: "PASSWORD_RESET",
          linkTokenHash: tokenHash,
          consumedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
      }),
    );

    if (prismaToken) {
      await prisma.verificationToken.update({
        where: { id: prismaToken.id },
        data: { consumedAt: new Date() },
      });

      return prismaToken;
    }

    const found = memoryStore.tokens.find(
      (entry) =>
        entry.purpose === "PASSWORD_RESET" &&
        entry.linkTokenHash === tokenHash &&
        !entry.consumedAt &&
        entry.expiresAt > new Date(),
    );

    if (!found) {
      return null;
    }

    found.consumedAt = new Date();
    return found;
  },

  async updatePassword(userId: string, passwordHash: string) {
    const prismaUser = await safely(() =>
      prisma.user.update({
        where: { id: userId },
        data: {
          passwordHash,
        },
      }),
    );

    if (prismaUser) {
      return toAuthUser(prismaUser);
    }

    const user = memoryStore.users.find((entry) => entry.id === userId);

    if (!user) {
      return null;
    }

    user.passwordHash = passwordHash;
    return toAuthUser(user);
  },

  async setTwoFactor(userId: string, enabled: boolean, channel: TwoFactorChannel) {
    const prismaUser = await safely(() =>
      prisma.user.update({
        where: { id: userId },
        data: {
          isTwoFactorEnabled: enabled,
          twoFactorChannel: channel,
        },
      }),
    );

    if (prismaUser) {
      return toAuthUser(prismaUser);
    }

    const user = memoryStore.users.find((entry) => entry.id === userId);

    if (!user) {
      return null;
    }

    user.isTwoFactorEnabled = enabled;
    user.twoFactorChannel = channel;
    return toAuthUser(user);
  },

  async updateUserProfile(
    userId: string,
    input: Partial<
      Pick<
        StoredUser,
        | "bio"
        | "bannerImageUrl"
        | "imageUrl"
        | "whatsappUrl"
        | "instagramUrl"
        | "linkedinUrl"
        | "mediaQuality"
        | "emailVisibility"
        | "phoneVisibility"
      >
    >,
  ) {
    const prismaUser = await safely(() =>
      prisma.user.update({
        where: { id: userId },
        data: input,
      }),
    );

    if (prismaUser) {
      return toAuthUser(prismaUser);
    }

    const user = memoryStore.users.find((entry) => entry.id === userId);

    if (!user) {
      return null;
    }

    Object.assign(user, input);
    return toAuthUser(user);
  },

  async createSession(input: {
    userId: string;
    jti: string;
    ipAddress: string | null;
    userAgent: string | null;
  }) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const prismaSession = await safely(() =>
      prisma.activeSession.create({
        data: {
          userId: input.userId,
          jti: input.jti,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
          expiresAt,
        },
        include: {
          user: true,
        },
      }),
    );

    if (prismaSession) {
      return mapStoredSession(prismaSession, prismaSession.user);
    }

    const user = memoryStore.users.find((entry) => entry.id === input.userId);

    if (!user) {
      return null;
    }

    const session: StoredSession = {
      id: randomUUID(),
      userId: input.userId,
      jti: input.jti,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      expiresAt,
      revokedAt: null,
      createdAt: new Date(),
      lastSeenAt: new Date(),
    };

    memoryStore.sessions.push(session);

    return mapStoredSession(session, user);
  },

  async findSession(jti: string) {
    const prismaSession = await safely(() =>
      prisma.activeSession.findUnique({
        where: { jti },
        include: { user: true },
      }),
    );

    if (prismaSession && !prismaSession.revokedAt && prismaSession.expiresAt > new Date()) {
      return mapStoredSession(prismaSession, prismaSession.user);
    }

    const session = memoryStore.sessions.find(
      (entry) => entry.jti === jti && !entry.revokedAt && entry.expiresAt > new Date(),
    );

    if (!session) {
      return null;
    }

    const user = memoryStore.users.find((entry) => entry.id === session.userId);
    return user ? mapStoredSession(session, user) : null;
  },

  async revokeSession(jti: string) {
    const prismaSession = await safely(() =>
      prisma.activeSession.update({
        where: { jti },
        data: { revokedAt: new Date() },
      }),
    );

    if (prismaSession) {
      return true;
    }

    const session = memoryStore.sessions.find((entry) => entry.jti === jti);

    if (!session) {
      return false;
    }

    session.revokedAt = new Date();
    return true;
  },

  async revokeAllSessionsForUser(userId: string) {
    await safely(() =>
      prisma.activeSession.updateMany({
        where: {
          userId,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      }),
    );

    for (const session of memoryStore.sessions) {
      if (session.userId === userId && !session.revokedAt) {
        session.revokedAt = new Date();
      }
    }

    return true;
  },

  async upsertGoogleUser(input: {
    email: string;
    fullName: string;
    imageUrl?: string | null;
    googleId: string;
  }) {
    const email = normalizeEmail(input.email);

    const prismaUser = await safely(() =>
      prisma.user.upsert({
        where: { email: email ?? "" },
        create: {
          profileId: generateProfileId(),
          email,
          fullName: input.fullName,
          googleId: input.googleId,
          imageUrl: input.imageUrl ?? null,
          emailVerifiedAt: new Date(),
        },
        update: {
          googleId: input.googleId,
          fullName: input.fullName,
          imageUrl: input.imageUrl ?? null,
          emailVerifiedAt: new Date(),
        },
      }),
    );

    if (prismaUser) {
      return toAuthUser(prismaUser);
    }

    const existing = memoryStore.users.find((entry) => entry.email === email);

    if (existing) {
      existing.googleId = input.googleId;
      existing.fullName = input.fullName;
      existing.imageUrl = input.imageUrl ?? null;
      existing.emailVerifiedAt = new Date();
      return toAuthUser(existing);
    }

    const created = await this.createUser({
      email,
      fullName: input.fullName,
      googleId: input.googleId,
      emailVerifiedAt: new Date(),
    });

    return created;
  },

  async verifyContactAvailability(input: { email?: string | null; phone?: string | null }) {
    const email = normalizeEmail(input.email);
    const phone = normalizePhone(input.phone);

    const prismaUser = await safely(() =>
      prisma.user.findFirst({
        where: {
          OR: [{ email }, { phone }],
          deletedAt: null,
        },
      }),
    );

    if (prismaUser) {
      return false;
    }

    return !memoryStore.users.some(
      (entry) =>
        !entry.deletedAt &&
        ((email && entry.email === email) || (phone && entry.phone === phone)),
    );
  },

  getPrimaryIdentifier,
};
