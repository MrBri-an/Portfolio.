import { z } from "zod";

const phoneRegex = /^[+]?[0-9]{10,15}$/;

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name is required."),
    username: z.string().trim().min(3).max(24).optional().or(z.literal("")),
    email: z.email("Enter a valid email address.").optional().or(z.literal("")),
    phone: z
      .string()
      .trim()
      .regex(phoneRegex, "Enter a valid phone number.")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Password must include an uppercase letter.")
      .regex(/[a-z]/, "Password must include a lowercase letter.")
      .regex(/[0-9]/, "Password must include a number."),
    captchaToken: z.string().min(1, "Captcha verification is required."),
  })
  .refine((data) => Boolean(data.email || data.phone), {
    message: "Provide at least an email address or a phone number.",
    path: ["email"],
  });

export const loginSchema = z.object({
  identifier: z.string().trim().min(3, "Enter your email or phone number."),
  password: z.string().min(1, "Password is required."),
  twoFactorCode: z.string().trim().optional(),
  twoFactorIdentifier: z.string().trim().optional(),
  captchaToken: z.string().min(1, "Captcha verification is required."),
});

export const verifyOtpSchema = z.object({
  identifier: z.string().trim().min(3),
  code: z.string().trim().length(6, "Enter the 6-digit code."),
  purpose: z.enum(["REGISTER", "LOGIN_2FA"]),
});

export const forgotPasswordSchema = z.object({
  identifier: z.string().trim().min(3),
  captchaToken: z.string().min(1, "Captcha verification is required."),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(12, "Reset token is invalid."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Password must include an uppercase letter.")
      .regex(/[a-z]/, "Password must include a lowercase letter.")
      .regex(/[0-9]/, "Password must include a number."),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const toggleTwoFactorSchema = z.object({
  enabled: z.boolean(),
  channel: z.enum(["EMAIL", "PHONE"]),
});
