import { Account } from "./account";

export type AuthOutput = {
  created: boolean;
  access_token: string;
  access_token_expires_at: string;
  refresh_token: string;
  refresh_token_expires_at: string;
  refresh_token_expires_in: number;
  account: Account;
};

export type AuthRefreshOutput = Pick<
  AuthOutput,
  | "access_token"
  | "access_token_expires_at"
  | "refresh_token"
  | "refresh_token_expires_at"
  | "refresh_token_expires_in"
>;
