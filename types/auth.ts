export type VerificationChannel = "EMAIL" | "PHONE";
export type VerificationPurpose =
  | "REGISTER"
  | "LOGIN_2FA"
  | "PASSWORD_RESET"
  | "EMAIL_CHANGE"
  | "PHONE_CHANGE";
export type TwoFactorChannel = "EMAIL" | "PHONE";
export type MediaQuality = "high" | "medium" | "low";
export type ContactVisibility = "PUBLIC" | "PRIVATE" | "HIDDEN";

export type AuthUser = {
  id: string;
  profileId: string;
  fullName: string;
  username: string | null;
  email: string | null;
  phone: string | null;
  imageUrl: string | null;
  bannerImageUrl: string | null;
  bio: string | null;
  whatsappUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  mediaQuality: MediaQuality;
  emailVisibility: ContactVisibility;
  phoneVisibility: ContactVisibility;
  emailVerifiedAt: Date | null;
  phoneVerifiedAt: Date | null;
  isTwoFactorEnabled: boolean;
  twoFactorChannel: TwoFactorChannel;
  verificationBadge: "NONE" | "VERIFIED" | "PREMIUM";
  createdAt: Date;
};

export type SessionPayload = {
  sub: string;
  profileId: string;
  jti: string;
  twoFactorPassed: boolean;
};

export type SessionUser = AuthUser & {
  sessionId: string;
};
