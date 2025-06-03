import config from "@/lib/config";
import { handleCurionaError } from "@/lib/error";
import { decrypt, encrypt } from "@/lib/helpers/crypto.helper";
import { NextRequest } from "next/server";
import { serializeCookie } from "oslo/cookie";

export type Session = {
  user: {
    id: number;
    email: string;
    name: string;
    avatar: string;
    joined_at: Date;
  };
  tokens: {
    access_token: string;
    access_token_expires_at: Date;
  };
};

export async function createSession(response: Response, data: Session) {
  const payload = await encrypt(data);

  const cookie = serializeCookie(
    config.SESSION_COOKIE_NAME,
    encodeURIComponent(payload),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    }
  );

  response.headers.append("Set-Cookie", cookie);

  return payload;
}

export async function getSession(
  request: NextRequest
): Promise<Session | null> {
  const sessionCookie = request.cookies.get(config.SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const session = await decrypt<Session>(
      decodeURIComponent(sessionCookie.value)
    );

    if (!session) {
      return null;
    }

    return session;
  } catch (error) {
    const err = handleCurionaError(error);
    console.error(err);
    return null;
  }
}

export const shouldRefreshToken = (
  session: Session,
  thresholdMs: number
): boolean => {
  if (!session.tokens?.access_token_expires_at || isSessionExpired(session)) {
    return false;
  }

  const expiryTime = new Date(session.tokens.access_token_expires_at).getTime();
  const currentTime = new Date().getTime();

  return expiryTime - currentTime < thresholdMs;
};

export function isSessionExpired(session: Session | null) {
  if (!session) {
    return true;
  }

  return !session.tokens || new Date() > session.tokens.access_token_expires_at;
}

export async function destroySession(response: Response) {
  const cookie = serializeCookie(config.SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });

  response.headers.append("Set-Cookie", cookie);
}
