"use server";
import { auth } from "@/lib/auth";
import config from "@/lib/config";
import { encrypt } from "@/lib/helpers/crypto.helper";
import { APIResponse } from "@/lib/services/api.service";
import { AuthService } from "@/lib/services/auth.service";
import { Session } from "@/lib/session";
import { AuthRefreshOutput } from "@/types/api-auth";
import { cookies } from "next/headers";

const authService = new AuthService();

export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(config.SESSION_COOKIE_NAME);
  cookieStore.delete("refresh_token");
}

export async function refreshSessionAction(): Promise<
  Partial<APIResponse<AuthRefreshOutput>> & { newSession?: Session }
> {
  const session = await auth();

  if (!session) {
    return {
      success: false,
      message: "Session not found",
    };
  }

  const cookieStore = await cookies();
  const refresh = cookieStore.get("refresh_token");
  if (!refresh?.value) {
    return {
      success: false,
      message: "Refresh token not found",
    };
  }

  const result = await authService.refresh(refresh.value);

  if (!result.success) {
    cookieStore.delete(config.SESSION_COOKIE_NAME);
    cookieStore.delete("refresh_token");
    return result;
  }

  const newSession: Session = {
    ...session,
    tokens: {
      access_token: result.data.access_token,
      access_token_expires_at: new Date(result.data.access_token_expires_at),
    },
  };

  const payload = await encrypt<Session>(newSession);

  cookieStore.set(config.SESSION_COOKIE_NAME, encodeURIComponent(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  cookieStore.set("refresh_token", result.data.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: result.data.refresh_token_expires_in,
    expires: new Date(result.data.refresh_token_expires_at),
  });

  return {
    ...result,
    newSession,
  };
}
