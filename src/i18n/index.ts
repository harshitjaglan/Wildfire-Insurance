import en from "../locales/en.json";
import es from "../locales/es.json";

export type Locale = "en" | "es";

type TranslationValue = string | number | TranslationObject | PluralTemplate;
interface TranslationObject {
  [key: string]: TranslationValue;
}

interface PluralTemplate {
  one: string;
  other: string;
}

const messages: Record<Locale, TranslationObject> = {
  en: en as TranslationObject,
  es: es as TranslationObject,
};

let currentLocale: Locale = "en";

export function setLocale(locale: Locale) {
  if (messages[locale]) {
    currentLocale = locale;
  } else {
    console.warn(`Unknown locale "${locale}", falling back to "en"`);
    currentLocale = "en";
  }
}

export function getLocale(): Locale {
  return currentLocale;
}

export interface TOptions {
  values?: Record<string, string | number>;
  count?: number;
}

export function t(key: string, options: TOptions = {}): string {
  const { values = {}, count } = options;

  const dict = messages[currentLocale] ?? {};
  let template = getNested(dict, key);

  // fallback: if key not found, just return the key
  if (template === undefined || template === null) {
    return key;
  }

  if (typeof count === "number" && isPluralTemplate(template)) {
    template = count === 1 ? template.one : template.other;
  }

  const allValues: Record<string, string | number> = { ...values };
  if (typeof count === "number" && allValues.count === undefined) {
    allValues.count = count;
  }

  if (typeof template !== "string") {
    return String(template);
  }

  return interpolate(template, allValues);
}

// --- helpers ---

function getNested(obj: TranslationObject, path: string): TranslationValue | undefined {
  return path.split(".").reduce<TranslationValue | undefined>((acc, part) => {
    if (acc === undefined || acc === null) return undefined;
    if (typeof acc !== "object") return undefined;
    return (acc as TranslationObject)[part];
  }, obj);
}

function interpolate(str: string, values: Record<string, string | number>): string {
  return Object.keys(values).reduce((acc, key) => {
    const value = String(values[key]);
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    return acc.replace(regex, value);
  }, str);
}

function isPluralTemplate(value: TranslationValue): value is PluralTemplate {
  return (
    typeof value === "object" &&
    value !== null &&
    "one" in value &&
    "other" in value &&
    typeof (value as any).one === "string" &&
    typeof (value as any).other === "string"
  );
}
