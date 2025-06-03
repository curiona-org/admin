import { Google } from "arctic";

export const google = new Google(
  process.env.AUTH_GOOGLE_ID ?? "",
  process.env.AUTH_GOOGLE_SECRET ?? "",
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/sign-in/callback/google"
    : "https://curiona.netlify.app/sign-in/callback/google"
);
