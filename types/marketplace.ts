import type { AuthUser, MediaQuality } from "@/types/auth";

export type ListingStatus = "AVAILABLE" | "RENTED" | "SOLD";
export type MediaKind = "IMAGE" | "VIDEO" | "DOCUMENT";
export type PricePeriod = "PER_YEAR" | "PER_MONTH" | "FOR_SALE" | "NEGOTIABLE";
export type ListingSort = "newest" | "oldest" | "cheapest" | "expensive";

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  isSystem: boolean;
  sortOrder: number;
};

export type ListingMediaRecord = {
  id: string;
  listingId: string;
  kind: MediaKind;
  url: string;
  publicId: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  originalName: string | null;
  quality: MediaQuality;
  width: number | null;
  height: number | null;
  position: number;
};

export type ListingRecord = {
  id: string;
  ownerId: string;
  categoryId: string;
  title: string;
  description: string;
  price: number;
  pricePeriod: PricePeriod;
  locationText: string;
  latitude: number | null;
  longitude: number | null;
  status: ListingStatus;
  viewsCount: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date | null;
};

export type ListingLikeRecord = {
  id: string;
  listingId: string;
  userId: string;
  createdAt: Date;
};

export type ListingSaveRecord = ListingLikeRecord;
export type ListingFavoriteRecord = ListingLikeRecord;

export type ListingViewRecord = {
  id: string;
  listingId: string;
  viewerIp: string;
  userId: string | null;
  viewedAt: Date;
};

export type RatingRecord = {
  id: string;
  raterId: string;
  ratedUserId: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ProfileViewRecord = {
  id: string;
  profileUserId: string;
  viewerIp: string;
  viewerUserId: string | null;
  viewedAt: Date;
};

export type CommentRecord = {
  id: string;
  listingId: string;
  authorId: string;
  body: string;
  parentId: string | null;
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type CommentLikeRecord = {
  id: string;
  commentId: string;
  userId: string;
  createdAt: Date;
};

export type MessageRecord = {
  id: string;
  conversationId: string | null;
  listingId: string | null;
  senderId: string;
  recipientId: string;
  kind: "TEXT" | "MEDIA" | "VOICE" | "CALL";
  body: string;
  mediaUrl: string | null;
  mediaMimeType: string | null;
  mediaName: string | null;
  deliveredAt: Date | null;
  seenAt: Date | null;
  deletedForEveryoneAt: Date | null;
  deletedForSenderAt: Date | null;
  deletedForRecipientAt: Date | null;
  createdAt: Date;
};

export type ConversationRecord = {
  id: string;
  starterId: string;
  recipientId: string;
  listingId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ConversationParticipantRecord = {
  id: string;
  conversationId: string;
  userId: string;
  archivedAt: Date | null;
  mutedAt: Date | null;
  createdAt: Date;
};

export type MessageReadRecord = {
  id: string;
  conversationId: string;
  userId: string;
  readAt: Date;
};

export type UserBlockRecord = {
  id: string;
  blockerId: string;
  blockedId: string;
  reason: string | null;
  createdAt: Date;
};

export type UserReportRecord = {
  id: string;
  reporterId: string;
  reportedId: string;
  listingId: string | null;
  messageId: string | null;
  reason: string;
  status: "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";
  createdAt: Date;
};

export type CallLogRecord = {
  id: string;
  conversationId: string;
  callerId: string;
  recipientId: string;
  type: "AUDIO" | "VIDEO";
  status: "MISSED" | "DECLINED" | "COMPLETED";
  startedAt: Date;
  endedAt: Date | null;
};

export type CallLogData = CallLogRecord & {
  caller: AuthUser;
  recipient: AuthUser;
  direction: "incoming" | "outgoing";
};

export type ChatMessage = MessageRecord & {
  sender: AuthUser;
  recipient: AuthUser;
  canDeleteForEveryone: boolean;
};

export type ConversationSummary = {
  id: string;
  otherUser: AuthUser;
  listing: ListingCardData | null;
  lastMessage: ChatMessage | null;
  unreadCount: number;
  isBlocked: boolean;
  updatedAt: Date;
};

export type ConversationDetail = ConversationSummary & {
  messages: ChatMessage[];
  calls: CallLogData[];
};

export type PasswordResetTokenRecord = {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
};

export type ListingCardData = {
  id: string;
  title: string;
  description: string;
  price: number;
  pricePeriod: PricePeriod;
  locationText: string;
  latitude: number | null;
  longitude: number | null;
  status: ListingStatus;
  createdAt: Date;
  expiresAt: Date | null;
  viewsCount: number;
  commentCount: number;
  likeCount: number;
  saveCount: number;
  favoriteCount: number;
  viewerHasLiked: boolean;
  viewerHasSaved: boolean;
  viewerHasFavorited: boolean;
  category: CategoryRecord;
  mediaItems: ListingMediaRecord[];
  owner: AuthUser;
};

export type ListingDetailData = ListingCardData & {
  galleryLabel: string;
};

export type ListingFeedFilters = {
  categorySlug?: string;
  query?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: ListingSort;
  cursor?: string;
  take?: number;
};

export type PaginatedListings = {
  items: ListingCardData[];
  nextCursor: string | null;
  total: number;
};

export type ListingMapPin = {
  id: string;
  title: string;
  price: number;
  pricePeriod: PricePeriod;
  locationText: string;
  latitude: number | null;
  longitude: number | null;
};

export type ListingMediaInput = {
  url: string;
  kind: MediaKind;
  mimeType?: string | null;
  sizeBytes?: number | null;
  originalName?: string | null;
  publicId?: string | null;
  width?: number | null;
  height?: number | null;
};

export type RatingSummary = {
  average: number;
  count: number;
};

export type ProfileStats = {
  listings: number;
  likesReceived: number;
  savesReceived: number;
  profileViews: number;
};

export type ProfileInsightPoint = {
  label: string;
  visits: number;
  impressions: number;
  chats: number;
  growth: number;
};

export type ProfilePageData = {
  user: AuthUser;
  rating: RatingSummary;
  stats: ProfileStats;
  listings: ListingCardData[];
  insights: ProfileInsightPoint[];
  canRate: boolean;
};

export type CommentThread = {
  id: string;
  body: string;
  likesCount: number;
  createdAt: Date;
  deletedAt: Date | null;
  author: AuthUser;
  replies: CommentThread[];
};
