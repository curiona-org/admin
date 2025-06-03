const config = {
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "",
  SESSION_COOKIE_NAME:
    process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME || "curiona-session",
};

export default config;
