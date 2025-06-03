"use server";
import config from "@/lib/config";
import { handleCurionaError } from "@/lib/error";
import { google } from "@/lib/google_oauth";
import { encrypt } from "@/lib/helpers/crypto.helper";
import { APIResponse } from "@/lib/services/api.service";
import { AuthService } from "@/lib/services/auth.service";
import { AuthOutput } from "@/types/api-auth";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const authService = new AuthService();

export type SignInActionInput = {
  email: string;
  password: string;
};

export async function signInAction({
  email,
  password,
}: SignInActionInput): Promise<APIResponse<AuthOutput>> {
  try {
    const result = await authService.loginEmailPassword({ email, password });

    const cookieStore = await cookies();

    const session = await encrypt({
      tokens: {
        access_token: result.data.access_token,
        access_token_expires_at: new Date(result.data.access_token_expires_at),
      },
      user: {
        ...result.data.account,
      },
    });

    cookieStore.set(config.SESSION_COOKIE_NAME, encodeURIComponent(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: result.data.refresh_token_expires_in,
      expires: new Date(result.data.refresh_token_expires_at),
    });

    cookieStore.set("refresh_token", result.data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: result.data.refresh_token_expires_in,
      expires: new Date(result.data.refresh_token_expires_at),
    });

    return result;
  } catch (error) {
    throw handleCurionaError(error);
  }
}

export async function signInGoogleAction() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const authorizationURL = google.createAuthorizationURL(state, codeVerifier, [
    "openid",
    "profile",
    "email",
  ]);

  const cookieStore = await cookies();

  cookieStore.set("google_oauth_state", state, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });

  cookieStore.set("google_code_verifier", codeVerifier, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });

  redirect(authorizationURL.toString());
}
