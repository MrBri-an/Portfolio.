import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPricePeriod(value: string) {
  const labels: Record<string, string> = {
    PER_YEAR: "per year",
    PER_MONTH: "per month",
    FOR_SALE: "for sale",
    NEGOTIABLE: "negotiable",
  };

  return labels[value] ?? value.toLowerCase();
}

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function maskIdentifier(value: string) {
  if (value.includes("@")) {
    const [name, domain] = value.split("@");
    return `${name.slice(0, 2)}***@${domain}`;
  }

  return `${value.slice(0, 4)}***${value.slice(-2)}`;
}
