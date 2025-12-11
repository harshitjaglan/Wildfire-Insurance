import { cookies } from "next/headers";
import en from "../locales/en.json";
import es from "../locales/es.json";
import zh from "../locales/zh.json";

const messages = { en, es, zh } as const;
export type Locale = keyof typeof messages;

export function getCurrentLocale(): Locale {
  const cookieLang = cookies().get("lang")?.value as Locale | undefined;
  if (cookieLang && cookieLang in messages) return cookieLang;
  return "en";
}

function getNested(obj: any, path: string) {
  return path.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

function interpolate(str: string, values: Record<string, string | number>) {
  return Object.keys(values).reduce(
    (acc, key) =>
      acc.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), String(values[key])),
    str
  );
}

export function t(
  key: string,
  options?: { values?: Record<string, string | number>; count?: number }
) {
  const locale = getCurrentLocale();
  const dict = messages[locale];
  const { values = {}, count } = options || {};

  let template = getNested(dict, key);

  if (template === undefined || template === null) return key;

  if (typeof count === "number" && typeof template === "object") {
    template = count === 1 ? template.one : template.other;
  }

  if (typeof template !== "string") return key;

  return interpolate(template, values);
}
