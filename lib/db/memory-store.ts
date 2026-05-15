import type {
  AuthUser,
  ContactVisibility,
  MediaQuality,
  TwoFactorChannel,
  VerificationChannel,
  VerificationPurpose,
} from "@/types/auth";
import type {
  CategoryRecord,
  CallLogRecord,
  ConversationParticipantRecord,
  ConversationRecord,
  CommentLikeRecord,
  CommentRecord,
  ListingMediaRecord,
  ListingFavoriteRecord,
  ListingLikeRecord,
  ListingRecord,
  ListingSaveRecord,
  ListingViewRecord,
  MessageReadRecord,
  MessageRecord,
  PasswordResetTokenRecord,
  ProfileViewRecord,
  RatingRecord,
  UserBlockRecord,
  UserReportRecord,
} from "@/types/marketplace";

export type StoredVerificationToken = {
  id: string;
  userId: string;
  identifier: string;
  purpose: VerificationPurpose;
  channel: VerificationChannel;
  codeHash: string;
  linkTokenHash: string;
  expiresAt: Date;
  consumedAt: Date | null;
  createdAt: Date;
};

export type StoredSession = {
  id: string;
  userId: string;
  jti: string;
  userAgent: string | null;
  ipAddress: string | null;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
  lastSeenAt: Date;
};

export type StoredUser = AuthUser & {
  passwordHash: string | null;
  googleId: string | null;
  deleteScheduledAt: Date | null;
  deletedAt: Date | null;
};

type MemoryStore = {
  users: StoredUser[];
  tokens: StoredVerificationToken[];
  sessions: StoredSession[];
  categories: CategoryRecord[];
  listings: ListingRecord[];
  listingMedia: ListingMediaRecord[];
  listingLikes: ListingLikeRecord[];
  listingSaves: ListingSaveRecord[];
  listingFavorites: ListingFavoriteRecord[];
  listingViews: ListingViewRecord[];
  ratings: RatingRecord[];
  profileViews: ProfileViewRecord[];
  comments: CommentRecord[];
  commentLikes: CommentLikeRecord[];
  conversations: ConversationRecord[];
  conversationParticipants: ConversationParticipantRecord[];
  messages: MessageRecord[];
  messageReads: MessageReadRecord[];
  userBlocks: UserBlockRecord[];
  userReports: UserReportRecord[];
  callLogs: CallLogRecord[];
  passwordResetTokens: PasswordResetTokenRecord[];
};

const globalState = globalThis as typeof globalThis & {
  __nestfindMemoryStore?: MemoryStore;
};

function createDemoUser(input: {
  id: string;
  profileId: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  imageUrl?: string | null;
  bannerImageUrl?: string | null;
  bio?: string | null;
  whatsappUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  mediaQuality?: MediaQuality;
  emailVisibility?: ContactVisibility;
  phoneVisibility?: ContactVisibility;
  createdAt?: Date;
}): StoredUser {
  const createdAt = input.createdAt ?? new Date("2026-01-01T09:00:00.000Z");

  return {
    id: input.id,
    profileId: input.profileId,
    fullName: input.fullName,
    username: input.username,
    email: input.email,
    phone: input.phone,
    imageUrl: input.imageUrl ?? null,
    bannerImageUrl: input.bannerImageUrl ?? null,
    bio: input.bio ?? null,
    whatsappUrl: input.whatsappUrl ?? null,
    instagramUrl: input.instagramUrl ?? null,
    linkedinUrl: input.linkedinUrl ?? null,
    mediaQuality: input.mediaQuality ?? "high",
    emailVisibility: input.emailVisibility ?? "PUBLIC",
    phoneVisibility: input.phoneVisibility ?? "PUBLIC",
    emailVerifiedAt: createdAt,
    phoneVerifiedAt: createdAt,
    isTwoFactorEnabled: false,
    twoFactorChannel: "EMAIL",
    verificationBadge: "VERIFIED",
    createdAt,
    passwordHash: null,
    googleId: null,
    deleteScheduledAt: null,
    deletedAt: null,
  };
}

const seedUsers: StoredUser[] = [
  createDemoUser({
    id: "demo-user-ada",
    profileId: "NF-DEMOADA",
    fullName: "Adaeze Okafor",
    username: "adaezelives",
    email: "adaeze@nestfind.demo",
    phone: "+2348010001000",
    bio: "Property curator focused on clean, camera-ready Lagos rentals and warm client communication.",
    whatsappUrl: "https://wa.me/2348010001000",
    instagramUrl: "https://instagram.com/adaezelives",
    linkedinUrl: "https://linkedin.com/in/adaezelives",
    bannerImageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  }),
  createDemoUser({
    id: "demo-user-tunde",
    profileId: "NF-DEMOTUN",
    fullName: "Tunde Balogun",
    username: "tundehomes",
    email: "tunde@nestfind.demo",
    phone: "+2348090009000",
    bio: "Helping families find roomy homes with practical layouts, verified details, and flexible viewing times.",
    whatsappUrl: "https://wa.me/2348090009000",
    instagramUrl: "https://instagram.com/tundehomes",
    linkedinUrl: "https://linkedin.com/in/tundehomes",
    bannerImageUrl:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  }),
];

const seedCategories: CategoryRecord[] = [
  { id: "cat-house", name: "House", slug: "house", icon: "Home", isSystem: true, sortOrder: 1 },
  { id: "cat-apartment", name: "Apartment", slug: "apartment", icon: "Building2", isSystem: true, sortOrder: 2 },
  { id: "cat-studio", name: "Studio", slug: "studio", icon: "LayoutPanelTop", isSystem: true, sortOrder: 3 },
  { id: "cat-land", name: "Land", slug: "land", icon: "Map", isSystem: true, sortOrder: 4 },
  { id: "cat-commercial", name: "Commercial", slug: "commercial", icon: "Store", isSystem: true, sortOrder: 5 },
  { id: "cat-shortlet", name: "Shortlet", slug: "shortlet", icon: "KeyRound", isSystem: true, sortOrder: 6 },
  { id: "cat-room", name: "Room", slug: "room", icon: "BedDouble", isSystem: true, sortOrder: 7 },
  { id: "cat-duplex", name: "Duplex", slug: "duplex", icon: "PanelsTopLeft", isSystem: true, sortOrder: 8 },
  { id: "cat-mansion", name: "Mansion", slug: "mansion", icon: "Castle", isSystem: true, sortOrder: 9 },
];

const seedListings: ListingRecord[] = [
  {
    id: "listing-lekki-duplex",
    ownerId: "demo-user-ada",
    categoryId: "cat-duplex",
    title: "Lekki sunrise duplex with rooftop lounge",
    description:
      "A bright duplex with layered lighting, ensuite bedrooms, and a social rooftop view made for evening showings.",
    price: 18500000,
    pricePeriod: "PER_YEAR",
    locationText: "Lekki Phase 1, Lagos",
    latitude: 6.4474,
    longitude: 3.4723,
    status: "AVAILABLE",
    viewsCount: 128,
    createdAt: new Date("2026-03-18T08:30:00.000Z"),
    updatedAt: new Date("2026-03-18T08:30:00.000Z"),
    expiresAt: null,
  },
  {
    id: "listing-wuse-shortlet",
    ownerId: "demo-user-tunde",
    categoryId: "cat-shortlet",
    title: "Shortlet studio near Wuse business district",
    description:
      "Compact, polished, and designed for quick move-ins with strong natural light and secure access control.",
    price: 145000,
    pricePeriod: "PER_MONTH",
    locationText: "Wuse 2, Abuja",
    latitude: 9.0765,
    longitude: 7.3986,
    status: "AVAILABLE",
    viewsCount: 84,
    createdAt: new Date("2026-03-22T13:15:00.000Z"),
    updatedAt: new Date("2026-03-22T13:15:00.000Z"),
    expiresAt: null,
  },
  {
    id: "listing-ph-mansion",
    ownerId: "demo-user-tunde",
    categoryId: "cat-mansion",
    title: "Port Harcourt family mansion with private cinema",
    description:
      "A large-format family property with green space, multiple lounges, and strong long-term buyer appeal.",
    price: 72000000,
    pricePeriod: "FOR_SALE",
    locationText: "New GRA, Port Harcourt",
    latitude: 4.8156,
    longitude: 7.0498,
    status: "AVAILABLE",
    viewsCount: 211,
    createdAt: new Date("2026-04-02T10:00:00.000Z"),
    updatedAt: new Date("2026-04-02T10:00:00.000Z"),
    expiresAt: null,
  },
];

const seedListingMedia: ListingMediaRecord[] = [
  {
    id: "media-1",
    listingId: "listing-lekki-duplex",
    kind: "IMAGE",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    publicId: null,
    mimeType: "image/jpeg",
    sizeBytes: null,
    originalName: "lekki-duplex-exterior.jpg",
    quality: "high",
    width: 1400,
    height: 933,
    position: 0,
  },
  {
    id: "media-2",
    listingId: "listing-lekki-duplex",
    kind: "IMAGE",
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    publicId: null,
    mimeType: "image/jpeg",
    sizeBytes: null,
    originalName: "lekki-duplex-interior.jpg",
    quality: "high",
    width: 1400,
    height: 933,
    position: 1,
  },
  {
    id: "media-3",
    listingId: "listing-wuse-shortlet",
    kind: "IMAGE",
    url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
    publicId: null,
    mimeType: "image/jpeg",
    sizeBytes: null,
    originalName: "wuse-shortlet.jpg",
    quality: "high",
    width: 1400,
    height: 933,
    position: 0,
  },
  {
    id: "media-4",
    listingId: "listing-ph-mansion",
    kind: "IMAGE",
    url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80",
    publicId: null,
    mimeType: "image/jpeg",
    sizeBytes: null,
    originalName: "port-harcourt-mansion.jpg",
    quality: "high",
    width: 1400,
    height: 933,
    position: 0,
  },
];

const seedRatings: RatingRecord[] = [
  {
    id: "rating-1",
    raterId: "demo-user-tunde",
    ratedUserId: "demo-user-ada",
    score: 5,
    createdAt: new Date("2026-04-10T08:00:00.000Z"),
    updatedAt: new Date("2026-04-10T08:00:00.000Z"),
  },
  {
    id: "rating-2",
    raterId: "demo-user-ada",
    ratedUserId: "demo-user-tunde",
    score: 4,
    createdAt: new Date("2026-04-12T08:00:00.000Z"),
    updatedAt: new Date("2026-04-12T08:00:00.000Z"),
  },
];

const seedMessages: MessageRecord[] = [
  {
    id: "message-seed-1",
    conversationId: "conversation-seed-1",
    listingId: "listing-lekki-duplex",
    senderId: "demo-user-ada",
    recipientId: "demo-user-tunde",
    kind: "TEXT",
    body: "Thanks again for that inspection referral.",
    mediaUrl: null,
    mediaMimeType: null,
    mediaName: null,
    deliveredAt: new Date("2026-04-10T10:00:05.000Z"),
    seenAt: new Date("2026-04-10T10:01:00.000Z"),
    deletedForEveryoneAt: null,
    deletedForSenderAt: null,
    deletedForRecipientAt: null,
    createdAt: new Date("2026-04-10T10:00:00.000Z"),
  },
  {
    id: "message-seed-2",
    conversationId: "conversation-seed-1",
    listingId: "listing-lekki-duplex",
    senderId: "demo-user-tunde",
    recipientId: "demo-user-ada",
    kind: "TEXT",
    body: "Anytime. Your client closed smoothly.",
    mediaUrl: null,
    mediaMimeType: null,
    mediaName: null,
    deliveredAt: new Date("2026-04-10T10:05:04.000Z"),
    seenAt: null,
    deletedForEveryoneAt: null,
    deletedForSenderAt: null,
    deletedForRecipientAt: null,
    createdAt: new Date("2026-04-10T10:05:00.000Z"),
  },
];

const seedConversations: ConversationRecord[] = [
  {
    id: "conversation-seed-1",
    starterId: "demo-user-tunde",
    recipientId: "demo-user-ada",
    listingId: "listing-lekki-duplex",
    createdAt: new Date("2026-04-10T10:00:00.000Z"),
    updatedAt: new Date("2026-04-10T10:05:00.000Z"),
  },
];

const seedCallLogs: CallLogRecord[] = [
  {
    id: "call-seed-1",
    conversationId: "conversation-seed-1",
    callerId: "demo-user-tunde",
    recipientId: "demo-user-ada",
    type: "AUDIO",
    status: "COMPLETED",
    startedAt: new Date("2026-04-11T12:00:00.000Z"),
    endedAt: new Date("2026-04-11T12:04:30.000Z"),
  },
];

const seedConversationParticipants: ConversationParticipantRecord[] = [
  {
    id: "conversation-participant-1",
    conversationId: "conversation-seed-1",
    userId: "demo-user-tunde",
    archivedAt: null,
    mutedAt: null,
    createdAt: new Date("2026-04-10T10:00:00.000Z"),
  },
  {
    id: "conversation-participant-2",
    conversationId: "conversation-seed-1",
    userId: "demo-user-ada",
    archivedAt: null,
    mutedAt: null,
    createdAt: new Date("2026-04-10T10:00:00.000Z"),
  },
];

const seedProfileViews: ProfileViewRecord[] = [
  {
    id: "view-1",
    profileUserId: "demo-user-ada",
    viewerIp: "demo",
    viewerUserId: "demo-user-tunde",
    viewedAt: new Date("2026-04-20T11:00:00.000Z"),
  },
];

const seedComments: CommentRecord[] = [
  {
    id: "comment-1",
    listingId: "listing-lekki-duplex",
    authorId: "demo-user-tunde",
    body: "The rooftop view looks great. Is there backup power on site?",
    parentId: null,
    likesCount: 1,
    createdAt: new Date("2026-04-18T09:30:00.000Z"),
    updatedAt: new Date("2026-04-18T09:30:00.000Z"),
    deletedAt: null,
  },
  {
    id: "comment-2",
    listingId: "listing-lekki-duplex",
    authorId: "demo-user-ada",
    body: "Yes, there is an inverter setup plus a standby generator.",
    parentId: "comment-1",
    likesCount: 0,
    createdAt: new Date("2026-04-18T09:45:00.000Z"),
    updatedAt: new Date("2026-04-18T09:45:00.000Z"),
    deletedAt: null,
  },
];

const seedCommentLikes: CommentLikeRecord[] = [
  {
    id: "comment-like-1",
    commentId: "comment-1",
    userId: "demo-user-ada",
    createdAt: new Date("2026-04-18T10:00:00.000Z"),
  },
];

export const memoryStore: MemoryStore = globalState.__nestfindMemoryStore ?? {
  users: seedUsers,
  tokens: [],
  sessions: [],
  categories: seedCategories,
  listings: seedListings,
  listingMedia: seedListingMedia,
  listingLikes: [
    {
      id: "like-1",
      listingId: "listing-lekki-duplex",
      userId: "demo-user-tunde",
      createdAt: new Date("2026-04-18T10:00:00.000Z"),
    },
  ],
  listingSaves: [
    {
      id: "save-1",
      listingId: "listing-lekki-duplex",
      userId: "demo-user-tunde",
      createdAt: new Date("2026-04-18T10:05:00.000Z"),
    },
  ],
  listingFavorites: [
    {
      id: "favorite-1",
      listingId: "listing-wuse-shortlet",
      userId: "demo-user-ada",
      createdAt: new Date("2026-04-19T08:00:00.000Z"),
    },
  ],
  listingViews: [],
  ratings: seedRatings,
  profileViews: seedProfileViews,
  comments: seedComments,
  commentLikes: seedCommentLikes,
  conversations: seedConversations,
  conversationParticipants: seedConversationParticipants,
  messages: seedMessages,
  messageReads: [],
  userBlocks: [],
  userReports: [],
  callLogs: seedCallLogs,
  passwordResetTokens: [],
};

if (!globalState.__nestfindMemoryStore) {
  globalState.__nestfindMemoryStore = memoryStore;
}

export function updateTwoFactorChannel(
  user: StoredUser,
  channel: TwoFactorChannel,
) {
  user.twoFactorChannel = channel;
}
