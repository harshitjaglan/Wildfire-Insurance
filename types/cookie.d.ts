// types/cookie.d.ts

declare module "cookie" {
  export interface CookieSerializeOptions {
    /**
     * Specifies the path of the cookie.
     * Defaults to "/".
     */
    path?: string;

    /**
     * Specifies the domain of the cookie.
     */
    domain?: string;

    /**
     * Specifies the maximum age of the cookie in seconds.
     */
    maxAge?: number;

    /**
     * Specifies the expiry date of the cookie as a Date object.
     */
    expires?: Date;

    /**
     * Specifies if the cookie is HTTP only.
     * Defaults to false.
     */
    httpOnly?: boolean;

    /**
     * Specifies if the cookie is secure.
     * Defaults to false.
     */
    secure?: boolean;

    /**
     * Specifies the SameSite attribute.
     * Can be true, false, 'lax', 'strict', or 'none'.
     */
    sameSite?: boolean | "lax" | "strict" | "none";
  }

  export function serialize(
    name: string,
    value: string,
    options?: CookieSerializeOptions
  ): string;
  export function parse(str: string): { [key: string]: string };
}
