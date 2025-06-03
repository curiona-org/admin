"use server";
import config from "@/lib/config";
import { handleCurionaError } from "@/lib/error";
import { decrypt } from "@/lib/helpers/crypto.helper";
import { Session } from "@/lib/session";
import { cookies } from "next/headers";
import { cache } from "react";

export const auth = cache(async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(config.SESSION_COOKIE_NAME);

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
});
