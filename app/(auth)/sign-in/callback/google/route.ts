import config from "@/lib/config";
import { handleCurionaError } from "@/lib/error";
import { google } from "@/lib/google_oauth";
import { encrypt } from "@/lib/helpers/crypto.helper";
import { APIResponse } from "@/lib/services/api.service";
import { AuthService } from "@/lib/services/auth.service";
import { AuthOutput } from "@/types/api-auth";
import { OAuth2Tokens } from "arctic";
import { cookies } from "next/headers";

const authService = new AuthService();

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();

  const storedState = cookieStore.get("google_oauth_state")?.value ?? null;
  const storedCodeVerifier =
    cookieStore.get("google_code_verifier")?.value ?? null;

  const isValidPayload =
    code !== null &&
    state !== null &&
    storedState !== null &&
    storedCodeVerifier !== null;

  if (!isValidPayload) {
    return new Response(null, {
      status: 400,
      statusText: "Bad Request",
    });
  }

  if (state !== storedState) {
    return new Response(null, {
      status: 403,
      statusText: "Forbidden",
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
  } catch (error) {
    const err = handleCurionaError(error);

    return new Response(null, {
      status: err.statusCode,
      statusText: err.errorMessage,
    });
  }

  if (!tokens || !(tokens instanceof OAuth2Tokens)) {
    return new Response(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  cookieStore.delete("google_oauth_state");
  cookieStore.delete("google_code_verifier");

  const idToken = tokens.idToken();
  let result: APIResponse<AuthOutput>;
  try {
    result = await authService.loginOAuth(idToken);
  } catch (error) {
    const err = handleCurionaError(error);

    return new Response(null, {
      status: err.statusCode,
      statusText: err.errorMessage,
    });
  }

  if (!result.success) {
    console.error(result.message);
    return new Response(null, {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  const session = await encrypt({
    user: {
      id: result.data.account.id,
      name: result.data.account.name,
      avatar: result.data.account.avatar,
      email: result.data.account.email,
      joined_at: new Date(result.data.account.joined_at),
    },
    tokens: {
      access_token: result.data.access_token,
      access_token_expires_at: new Date(result.data.access_token_expires_at),
    },
  });

  cookieStore.set(config.SESSION_COOKIE_NAME, encodeURIComponent(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/dashboard",
    },
  });
}
