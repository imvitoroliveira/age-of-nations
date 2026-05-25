import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging Tailwind classes safely.
 * Optimization: twMerge handles conflicts, reducing final CSS specificity issues.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Image URL optimization strategy.
 * Placeholder for WebP/Avif transformation logic via CDN/Supabase Storage.
 */
export function getOptimizedImageUrl(path: string, width: number = 800) {
  // If using Supabase Storage, we can append transformation params
  // This significantly reduces LCP and total payload size.
  return `${path}?width=${width}&format=webp&quality=80`;
}
