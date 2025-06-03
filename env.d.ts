declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_BACKEND_URL: string;

    APP_SECRET: string;
    AUTH_SECRET: string;
    AUTH_TRUSTED_HOST: boolean;
    AUTH_GOOGLE_ID: string;
    AUTH_GOOGLE_SECRET: string;
  }
}
