import { DefaultSession } from "next-auth";
import Account from "./account";

export type BackendJWT = {
  access_token: string;
  access_token_expires_at: string;
};

export type AuthenticatedUser = Account & {
  tokens: BackendJWT;
};

import "next-auth";
declare module "next-auth" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface User extends AuthenticatedUser {}

  interface Session extends DefaultSession {
    data: AuthenticatedUser;
    isLoggedIn: boolean;
  }
}

import "next-auth/jwt";
declare module "next-auth/jwt" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface JWT extends AuthenticatedUser {}
}
