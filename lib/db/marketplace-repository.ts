import { randomUUID } from "crypto";

import type { Category, Listing, ListingMedia, Prisma, User } from "@prisma/client";

import { authRepository } from "@/lib/db/auth-repository";
import { memoryStore } from "@/lib/db/memory-store";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { applyCloudinaryQuality } from "@/lib/marketplace";
import { sanitizeText } from "@/lib/security/sanitize";
import type { AuthUser, SessionUser } from "@/types/auth";
import type {
  CategoryRecord,
  CommentThread,
  ListingCardData,
  ListingFeedFilters,
  ListingMapPin,
  ListingMediaInput,
  ListingMediaRecord,
  ListingRecord,
  PaginatedListings,
  ProfileInsightPoint,
  ProfilePageData,
  RatingSummary,
} from "@/types/marketplace";

let prismaAvailable = Boolean(env.databaseUrl);

type PrismaListingBundle = Listing & {
  owner: User;
  category: Category;
  mediaItems: ListingMedia[];
  likes?: { userId: string }[];
  saves?: { userId: string }[];
  favorites?: { userId: string }[];
  _count: {
    comments: number;
    likes: number;
    saves: number;
    favorites: number;
    views: number;
  };
};

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

function toAuthUser(user: User): AuthUser {
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

function sortCategories(categories: CategoryRecord[]) {
  return [...categories].sort((left, right) => left.sortOrder - right.sortOrder);
}

function toCategoryRecord(category: Category): CategoryRecord {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    icon: category.icon,
    isSystem: category.isSystem,
    sortOrder: category.sortOrder,
  };
}

function toMediaRecord(media: ListingMedia): ListingMediaRecord {
  return {
    id: media.id,
    listingId: media.listingId,
    kind: media.kind,
    url: media.url,
    publicId: media.publicId,
    mimeType: media.mimeType,
    sizeBytes: media.sizeBytes,
    originalName: media.originalName,
    quality: media.quality,
    width: media.width,
    height: media.height,
    position: media.position,
  };
}

function toListingRecord(listing: Listing): ListingRecord {
  return {
    id: listing.id,
    ownerId: listing.ownerId,
    categoryId: listing.categoryId,
    title: listing.title,
    description: listing.description,
    price: listing.price,
    pricePeriod: listing.pricePeriod,
    locationText: listing.locationText,
    latitude: listing.latitude,
    longitude: listing.longitude,
    status: listing.status,
    viewsCount: listing.viewsCount,
    createdAt: listing.createdAt,
    updatedAt: listing.updatedAt,
    expiresAt: listing.expiresAt,
  };
}

async function getUserOrThrow(userId: string) {
  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
}

function getMemoryListingEngagement(listingId: string, viewerId?: string | null) {
  const likes = memoryStore.listingLikes.filter((entry) => entry.listingId === listingId);
  const saves = memoryStore.listingSaves.filter((entry) => entry.listingId === listingId);
  const favorites = memoryStore.listingFavorites.filter(
    (entry) => entry.listingId === listingId,
  );

  return {
    likeCount: likes.length,
    saveCount: saves.length,
    favoriteCount: favorites.length,
    viewerHasLiked: Boolean(viewerId && likes.some((entry) => entry.userId === viewerId)),
    viewerHasSaved: Boolean(viewerId && saves.some((entry) => entry.userId === viewerId)),
    viewerHasFavorited: Boolean(
      viewerId && favorites.some((entry) => entry.userId === viewerId),
    ),
  };
}

async function mapMemoryListingCard(
  listing: ListingRecord,
  viewerId?: string | null,
): Promise<ListingCardData> {
  const owner = await getUserOrThrow(listing.ownerId);
  const category = memoryStore.categories.find(
    (entry) => entry.id === listing.categoryId,
  );

  if (!category) {
    throw new Error("Listing category not found.");
  }

  const commentCount = memoryStore.comments.filter(
    (entry) => entry.listingId === listing.id && !entry.deletedAt,
  ).length;
  const mediaItems = memoryStore.listingMedia
    .filter((entry) => entry.listingId === listing.id)
    .sort((left, right) => left.position - right.position);
  const engagement = getMemoryListingEngagement(listing.id, viewerId);

  return {
    ...listing,
    commentCount,
    ...engagement,
    category,
    mediaItems,
    owner,
  };
}

function mapPrismaListingCard(
  listing: PrismaListingBundle,
  viewerId?: string | null,
): ListingCardData {
  return {
    ...toListingRecord(listing),
    commentCount: listing._count.comments,
    likeCount: listing._count.likes,
    saveCount: listing._count.saves,
    favoriteCount: listing._count.favorites,
    viewerHasLiked: Boolean(
      viewerId && listing.likes?.some((entry) => entry.userId === viewerId),
    ),
    viewerHasSaved: Boolean(
      viewerId && listing.saves?.some((entry) => entry.userId === viewerId),
    ),
    viewerHasFavorited: Boolean(
      viewerId && listing.favorites?.some((entry) => entry.userId === viewerId),
    ),
    category: toCategoryRecord(listing.category),
    mediaItems: listing.mediaItems
      .map((entry) => toMediaRecord(entry))
      .sort((left, right) => left.position - right.position),
    owner: toAuthUser(listing.owner),
  };
}

function buildPrismaListingInclude(viewerId?: string | null) {
  return {
    owner: true,
    category: true,
    mediaItems: {
      orderBy: { position: "asc" as const },
    },
    likes: viewerId
      ? {
          where: { userId: viewerId },
          select: { userId: true },
        }
      : false,
    saves: viewerId
      ? {
          where: { userId: viewerId },
          select: { userId: true },
        }
      : false,
    favorites: viewerId
      ? {
          where: { userId: viewerId },
          select: { userId: true },
        }
      : false,
    _count: {
      select: {
        comments: true,
        likes: true,
        saves: true,
        favorites: true,
        views: true,
      },
    },
  };
}

function buildInsightSeries(userId: string): ProfileInsightPoint[] {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const profileViews = memoryStore.profileViews.filter(
    (entry) => entry.profileUserId === userId,
  ).length;
  const listings = memoryStore.listings.filter((entry) => entry.ownerId === userId);
  const chats = memoryStore.messages.filter(
    (entry) => entry.senderId === userId || entry.recipientId === userId,
  ).length;

  return labels.map((label, index) => ({
    label,
    visits: Math.max(profileViews - 2 + index, 1),
    impressions: Math.max(listings.length * 18 + index * 4, 4),
    chats: Math.max(Math.floor(chats / 2) + (index % 3), 0),
    growth: Math.max(profileViews - 1 + index * 2, 1),
  }));
}

async function getRatingSummary(userId: string): Promise<RatingSummary> {
  const ratings = memoryStore.ratings.filter((entry) => entry.ratedUserId === userId);

  if (!ratings.length) {
    return {
      average: 0,
      count: 0,
    };
  }

  const average =
    ratings.reduce((sum, entry) => sum + entry.score, 0) / ratings.length;

  return {
    average: Number(average.toFixed(1)),
    count: ratings.length,
  };
}

async function getNestedComments(listingId: string): Promise<CommentThread[]> {
  const comments = memoryStore.comments
    .filter((entry) => entry.listingId === listingId)
    .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime());

  const roots = comments.filter((entry) => !entry.parentId);
  const replies = comments.filter((entry) => Boolean(entry.parentId));

  const mapComment = async (commentId: string): Promise<CommentThread | null> => {
    const comment = comments.find((entry) => entry.id === commentId);

    if (!comment) {
      return null;
    }

    const author = await getUserOrThrow(comment.authorId);
    const childReplies = await Promise.all(
      replies
        .filter((entry) => entry.parentId === comment.id)
        .map((entry) => mapComment(entry.id)),
    );

    return {
      id: comment.id,
      body: comment.body,
      likesCount: comment.likesCount,
      createdAt: comment.createdAt,
      deletedAt: comment.deletedAt,
      author,
      replies: childReplies.filter(Boolean) as CommentThread[],
    };
  };

  const tree = await Promise.all(roots.map((entry) => mapComment(entry.id)));
  return tree.filter(Boolean) as CommentThread[];
}

function hasMessageHistory(userAId: string, userBId: string) {
  return memoryStore.messages.some(
    (entry) =>
      (entry.senderId === userAId && entry.recipientId === userBId) ||
      (entry.senderId === userBId && entry.recipientId === userAId),
  );
}

function getListingOrderBy(sort: ListingFeedFilters["sort"]) {
  if (sort === "oldest") {
    return [{ createdAt: "asc" as const }];
  }

  if (sort === "cheapest") {
    return [{ price: "asc" as const }, { createdAt: "desc" as const }];
  }

  if (sort === "expensive") {
    return [{ price: "desc" as const }, { createdAt: "desc" as const }];
  }

  return [{ createdAt: "desc" as const }];
}

function filterMemoryListings(filters: ListingFeedFilters) {
  const query = filters.query?.trim().toLowerCase();
  const location = filters.location?.trim().toLowerCase();

  return memoryStore.listings.filter((listing) => {
    const category = memoryStore.categories.find((entry) => entry.id === listing.categoryId);

    if (filters.categorySlug && category?.slug !== filters.categorySlug) {
      return false;
    }

    if (query) {
      const haystack = `${listing.title} ${listing.description} ${listing.locationText}`.toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }

    if (location && !listing.locationText.toLowerCase().includes(location)) {
      return false;
    }

    if (typeof filters.minPrice === "number" && listing.price < filters.minPrice) {
      return false;
    }

    if (typeof filters.maxPrice === "number" && listing.price > filters.maxPrice) {
      return false;
    }

    return true;
  });
}

function sortMemoryListings(listings: ListingRecord[], sort: ListingFeedFilters["sort"]) {
  return [...listings].sort((left, right) => {
    if (sort === "oldest") {
      return left.createdAt.getTime() - right.createdAt.getTime();
    }

    if (sort === "cheapest") {
      return left.price - right.price || right.createdAt.getTime() - left.createdAt.getTime();
    }

    if (sort === "expensive") {
      return right.price - left.price || right.createdAt.getTime() - left.createdAt.getTime();
    }

    return right.createdAt.getTime() - left.createdAt.getTime();
  });
}

function toMapPins(items: ListingCardData[]): ListingMapPin[] {
  return items.map((listing) => ({
    id: listing.id,
    title: listing.title,
    price: listing.price,
    pricePeriod: listing.pricePeriod,
    locationText: listing.locationText,
    latitude: listing.latitude,
    longitude: listing.longitude,
  }));
}

export const marketplaceRepository = {
  async listCategories() {
    const prismaCategories = await safely(() =>
      prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
      }),
    );

    if (prismaCategories) {
      return prismaCategories.map((entry) => toCategoryRecord(entry));
    }

    return sortCategories(memoryStore.categories);
  },

  async listFeedListings(
    filters: ListingFeedFilters = {},
    viewerId?: string | null,
  ): Promise<PaginatedListings> {
    const take = filters.take ?? 8;
    const prismaWhere: Prisma.ListingWhereInput = {
      ...(filters.categorySlug
        ? {
            category: {
              slug: filters.categorySlug,
            },
          }
        : {}),
      ...(filters.query
        ? {
            OR: [
              { title: { contains: filters.query, mode: "insensitive" } },
              { description: { contains: filters.query, mode: "insensitive" } },
              { locationText: { contains: filters.query, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(filters.location
        ? {
            locationText: { contains: filters.location, mode: "insensitive" },
          }
        : {}),
      ...(typeof filters.minPrice === "number" || typeof filters.maxPrice === "number"
        ? {
            price: {
              ...(typeof filters.minPrice === "number" ? { gte: filters.minPrice } : {}),
              ...(typeof filters.maxPrice === "number" ? { lte: filters.maxPrice } : {}),
            },
          }
        : {}),
    };

    const prismaResult = await safely(async () => {
      const [items, total] = await Promise.all([
        prisma.listing.findMany({
          where: prismaWhere,
          orderBy: getListingOrderBy(filters.sort),
          take: take + 1,
          ...(filters.cursor ? { cursor: { id: filters.cursor }, skip: 1 } : {}),
          include: buildPrismaListingInclude(viewerId),
        }),
        prisma.listing.count({ where: prismaWhere }),
      ]);

      const pageItems = items.slice(0, take);

      return {
        items: pageItems.map((entry) =>
          mapPrismaListingCard(entry as PrismaListingBundle, viewerId),
        ),
        nextCursor: items.length > take ? pageItems[pageItems.length - 1]?.id ?? null : null,
        total,
      };
    });

    if (prismaResult) {
      return prismaResult;
    }

    const sorted = sortMemoryListings(filterMemoryListings(filters), filters.sort);
    const cursorIndex = filters.cursor
      ? sorted.findIndex((entry) => entry.id === filters.cursor)
      : -1;
    const start = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    const pageItems = sorted.slice(start, start + take);
    const mapped = await Promise.all(
      pageItems.map((entry) => mapMemoryListingCard(entry, viewerId)),
    );

    return {
      items: mapped,
      nextCursor:
        start + take < sorted.length ? pageItems[pageItems.length - 1]?.id ?? null : null,
      total: sorted.length,
    };
  },

  async listMapPins(filters: ListingFeedFilters = {}) {
    const result = await this.listFeedListings({ ...filters, take: 100 });
    return toMapPins(result.items);
  },

  async getListingById(listingId: string, viewerId?: string | null) {
    const prismaListing = await safely(() =>
      prisma.listing.findUnique({
        where: { id: listingId },
        include: buildPrismaListingInclude(viewerId),
      }),
    );

    if (prismaListing) {
      return {
        ...mapPrismaListingCard(prismaListing as PrismaListingBundle, viewerId),
        galleryLabel: `${prismaListing.title} gallery`,
      };
    }

    const listing = memoryStore.listings.find((entry) => entry.id === listingId);

    if (!listing) {
      return null;
    }

    const card = await mapMemoryListingCard(listing, viewerId);
    return {
      ...card,
      galleryLabel: `${card.title} gallery`,
    };
  },

  async createListing(input: {
    ownerId: string;
    categoryId: string;
    title: string;
    description: string;
    price: number;
    pricePeriod: ListingRecord["pricePeriod"];
    locationText: string;
    latitude?: number | null;
    longitude?: number | null;
    status: ListingRecord["status"];
    expiresAt?: Date | null;
    mediaItems: ListingMediaInput[];
    mediaQuality: "high" | "medium" | "low";
  }) {
    const mediaItems = input.mediaItems.slice(0, 20);

    const prismaListing = await safely(() =>
      prisma.listing.create({
        data: {
          ownerId: input.ownerId,
          categoryId: input.categoryId,
          title: sanitizeText(input.title),
          description: sanitizeText(input.description),
          price: input.price,
          pricePeriod: input.pricePeriod,
          locationText: sanitizeText(input.locationText),
          latitude: input.latitude ?? null,
          longitude: input.longitude ?? null,
          status: input.status,
          expiresAt: input.expiresAt ?? null,
          mediaItems: {
            create: mediaItems.map((media, index) => ({
              kind: media.kind,
              url: applyCloudinaryQuality(media.url, input.mediaQuality),
              publicId: media.publicId ?? null,
              mimeType: media.mimeType ?? null,
              sizeBytes: media.sizeBytes ?? null,
              originalName: media.originalName ?? null,
              quality: input.mediaQuality,
              width: media.width ?? null,
              height: media.height ?? null,
              position: index,
            })),
          },
        },
        include: buildPrismaListingInclude(input.ownerId),
      }),
    );

    if (prismaListing) {
      return mapPrismaListingCard(prismaListing as PrismaListingBundle, input.ownerId);
    }

    const listingId = randomUUID();
    const now = new Date();
    const listing: ListingRecord = {
      id: listingId,
      ownerId: input.ownerId,
      categoryId: input.categoryId,
      title: sanitizeText(input.title),
      description: sanitizeText(input.description),
      price: input.price,
      pricePeriod: input.pricePeriod,
      locationText: sanitizeText(input.locationText),
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      status: input.status,
      viewsCount: 0,
      createdAt: now,
      updatedAt: now,
      expiresAt: input.expiresAt ?? null,
    };

    memoryStore.listings.unshift(listing);

    mediaItems.forEach((media, index) => {
      memoryStore.listingMedia.push({
        id: randomUUID(),
        listingId,
        kind: media.kind,
        url: applyCloudinaryQuality(media.url, input.mediaQuality),
        publicId: media.publicId ?? null,
        mimeType: media.mimeType ?? null,
        sizeBytes: media.sizeBytes ?? null,
        originalName: media.originalName ?? null,
        quality: input.mediaQuality,
        width: media.width ?? null,
        height: media.height ?? null,
        position: index,
      });
    });

    return mapMemoryListingCard(listing, input.ownerId);
  },

  async listListingsByOwner(ownerId: string) {
    const prismaListings = await safely(() =>
      prisma.listing.findMany({
        where: { ownerId },
        orderBy: { createdAt: "desc" },
        include: buildPrismaListingInclude(ownerId),
      }),
    );

    if (prismaListings) {
      return prismaListings.map((entry) =>
        mapPrismaListingCard(entry as PrismaListingBundle, ownerId),
      );
    }

    const listings = memoryStore.listings.filter((entry) => entry.ownerId === ownerId);
    return Promise.all(listings.map((entry) => mapMemoryListingCard(entry, ownerId)));
  },

  async getProfilePageData(profileId: string, viewer: SessionUser | null, viewerIp: string) {
    const user = memoryStore.users.find((entry) => entry.profileId === profileId);

    if (!user) {
      return null;
    }

    if (viewer?.id !== user.id) {
      const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
      const existingView = memoryStore.profileViews.find(
        (entry) =>
          entry.profileUserId === user.id &&
          (entry.viewerUserId
            ? viewer?.id
              ? entry.viewerUserId === viewer.id
              : false
            : entry.viewerIp === viewerIp) &&
          entry.viewedAt.getTime() >= twentyFourHoursAgo,
      );

      if (!existingView) {
        memoryStore.profileViews.push({
          id: randomUUID(),
          profileUserId: user.id,
          viewerIp,
          viewerUserId: viewer?.id ?? null,
          viewedAt: new Date(),
        });
      }
    }

    const listings = await this.listListingsByOwner(user.id);
    const rating = await getRatingSummary(user.id);
    const stats = {
      listings: listings.length,
      likesReceived: listings.reduce((sum, entry) => sum + entry.likeCount, 0),
      savesReceived: listings.reduce((sum, entry) => sum + entry.saveCount, 0),
      profileViews: memoryStore.profileViews.filter(
        (entry) => entry.profileUserId === user.id,
      ).length,
    };

    return {
      user,
      rating,
      stats,
      listings,
      insights: buildInsightSeries(user.id),
      canRate: viewer
        ? viewer.id !== user.id && hasMessageHistory(viewer.id, user.id)
        : false,
    } satisfies ProfilePageData;
  },

  async recordListingView(input: {
    listingId: string;
    viewerIp: string;
    userId?: string | null;
  }) {
    const prismaView = await safely(() =>
      prisma.$transaction(async (tx) => {
        await tx.listingView.create({
          data: {
            listingId: input.listingId,
            viewerIp: input.viewerIp,
            userId: input.userId ?? null,
          },
        });

        return tx.listing.update({
          where: { id: input.listingId },
          data: { viewsCount: { increment: 1 } },
          select: { viewsCount: true },
        });
      }),
    );

    if (prismaView) {
      return prismaView.viewsCount;
    }

    const listing = memoryStore.listings.find((entry) => entry.id === input.listingId);

    if (!listing) {
      return 0;
    }

    listing.viewsCount += 1;
    memoryStore.listingViews.push({
      id: randomUUID(),
      listingId: input.listingId,
      viewerIp: input.viewerIp,
      userId: input.userId ?? null,
      viewedAt: new Date(),
    });

    return listing.viewsCount;
  },

  async toggleListingInteraction(input: {
    listingId: string;
    userId: string;
    type: "like" | "save" | "favorite";
  }) {
    const prismaResult = await safely(async () => {
      const where = {
        listingId_userId: {
          listingId: input.listingId,
          userId: input.userId,
        },
      };

      if (input.type === "like") {
        const existing = await prisma.listingLike.findUnique({ where });

        if (existing) {
          await prisma.listingLike.delete({ where });
          return { active: false };
        }

        await prisma.listingLike.create({
          data: {
            listingId: input.listingId,
            userId: input.userId,
          },
        });

        return { active: true };
      }

      if (input.type === "save") {
        const existing = await prisma.listingSave.findUnique({ where });

        if (existing) {
          await prisma.listingSave.delete({ where });
          return { active: false };
        }

        await prisma.listingSave.create({
          data: {
            listingId: input.listingId,
            userId: input.userId,
          },
        });

        return { active: true };
      }

      const existing = await prisma.listingFavorite.findUnique({ where });

      if (existing) {
        await prisma.listingFavorite.delete({ where });
        return { active: false };
      }

      await prisma.listingFavorite.create({
        data: {
          listingId: input.listingId,
          userId: input.userId,
        },
      });

      return { active: true };
    });

    if (prismaResult) {
      const listing = await this.getListingById(input.listingId, input.userId);
      return {
        ...prismaResult,
        likeCount: listing?.likeCount ?? 0,
        saveCount: listing?.saveCount ?? 0,
        favoriteCount: listing?.favoriteCount ?? 0,
      };
    }

    const collection =
      input.type === "like"
        ? memoryStore.listingLikes
        : input.type === "save"
          ? memoryStore.listingSaves
          : memoryStore.listingFavorites;
    const existing = collection.find(
      (entry) => entry.listingId === input.listingId && entry.userId === input.userId,
    );

    if (existing) {
      const index = collection.findIndex((entry) => entry.id === existing.id);
      collection.splice(index, 1);
    } else {
      collection.push({
        id: randomUUID(),
        listingId: input.listingId,
        userId: input.userId,
        createdAt: new Date(),
      });
    }

    const engagement = getMemoryListingEngagement(input.listingId, input.userId);

    return {
      active: !existing,
      likeCount: engagement.likeCount,
      saveCount: engagement.saveCount,
      favoriteCount: engagement.favoriteCount,
    };
  },

  async rateUser(input: { raterId: string; ratedUserId: string; score: number }) {
    if (input.raterId === input.ratedUserId) {
      throw new Error("You can't rate your own profile.");
    }

    if (!hasMessageHistory(input.raterId, input.ratedUserId)) {
      throw new Error("You can only rate users after exchanging at least one chat message.");
    }

    const existing = memoryStore.ratings.find(
      (entry) =>
        entry.raterId === input.raterId && entry.ratedUserId === input.ratedUserId,
    );

    if (existing) {
      existing.score = input.score;
      existing.updatedAt = new Date();
    } else {
      memoryStore.ratings.push({
        id: randomUUID(),
        raterId: input.raterId,
        ratedUserId: input.ratedUserId,
        score: input.score,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return getRatingSummary(input.ratedUserId);
  },

  async listComments(listingId: string) {
    return getNestedComments(listingId);
  },

  async createComment(input: {
    listingId: string;
    authorId: string;
    body: string;
    parentId?: string | null;
  }) {
    const comment = {
      id: randomUUID(),
      listingId: input.listingId,
      authorId: input.authorId,
      body: sanitizeText(input.body),
      parentId: input.parentId ?? null,
      likesCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    memoryStore.comments.push(comment);
    return getNestedComments(input.listingId);
  },

  async toggleCommentLike(input: { commentId: string; userId: string }) {
    const existing = memoryStore.commentLikes.find(
      (entry) => entry.commentId === input.commentId && entry.userId === input.userId,
    );
    const comment = memoryStore.comments.find((entry) => entry.id === input.commentId);

    if (!comment) {
      throw new Error("Comment not found.");
    }

    if (existing) {
      memoryStore.commentLikes = memoryStore.commentLikes.filter(
        (entry) => entry.id !== existing.id,
      );
      comment.likesCount = Math.max(comment.likesCount - 1, 0);
    } else {
      memoryStore.commentLikes.push({
        id: randomUUID(),
        commentId: input.commentId,
        userId: input.userId,
        createdAt: new Date(),
      });
      comment.likesCount += 1;
    }

    return comment.likesCount;
  },

  async sendMessage(input: { senderId: string; recipientId: string; body: string }) {
    memoryStore.messages.push({
      id: randomUUID(),
      conversationId: null,
      listingId: null,
      senderId: input.senderId,
      recipientId: input.recipientId,
      kind: "TEXT",
      body: sanitizeText(input.body),
      mediaUrl: null,
      mediaMimeType: null,
      mediaName: null,
      deliveredAt: new Date(),
      seenAt: null,
      deletedForEveryoneAt: null,
      deletedForSenderAt: null,
      deletedForRecipientAt: null,
      createdAt: new Date(),
    });

    return true;
  },
};
