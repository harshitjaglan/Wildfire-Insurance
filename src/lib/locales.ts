export const locales = ["en", "es", "zh"] as const;
export type Locale = (typeof locales)[number];