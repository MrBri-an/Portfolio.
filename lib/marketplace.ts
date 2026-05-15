import type { MediaQuality } from "@/types/auth";

export const mediaQualityOptions: Array<{
  value: MediaQuality;
  label: string;
  description: string;
  cloudinaryQuality: string;
}> = [
  {
    value: "high",
    label: "High (HD)",
    description: "Best clarity and larger uploads.",
    cloudinaryQuality: "q_auto:best",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Balanced quality and speed.",
    cloudinaryQuality: "q_auto:good",
  },
  {
    value: "low",
    label: "Low",
    description: "Smallest files for faster sharing.",
    cloudinaryQuality: "q_auto:low",
  },
];

export function getCloudinaryQuality(mediaQuality: MediaQuality) {
  return (
    mediaQualityOptions.find((option) => option.value === mediaQuality)
      ?.cloudinaryQuality ?? "q_auto:best"
  );
}

export function applyCloudinaryQuality(url: string, mediaQuality: MediaQuality) {
  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  const quality = getCloudinaryQuality(mediaQuality);

  if (url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/${quality}/`);
  }

  return url;
}
