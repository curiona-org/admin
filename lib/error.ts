import { AxiosError } from "axios";

export enum CurionaErrorCodes {
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  UNAUTHORIZED = "UNAUTHORIZED",
  ACCOUNT_SUSPENDED = "ACCOUNT_SUSPENDED",
  SIGNUP_DIFFERENT_METHOD = "SIGNUP_DIFFERENT_METHOD",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  SESSION_BLOCKED = "SESSION_BLOCKED",

  NOT_FOUND = "NOT_FOUND",
  DUPLICATE_DATA = "DUPLICATE_DATA",
  INVALID_DATA = "INVALID_DATA",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INTERNAL_ERROR = "INTERNAL_ERROR",

  LLM_PROVIDER_UNAVAILABLE = "LLM_PROVIDER_UNAVAILABLE",
  LLM_PROMPT_GENERATION_FAILED = "LLM_PROMPT_GENERATION_FAILED",
  LLM_INVALID_DATA = "LLM_INVALID_DATA",
}

export const ERROR_MESSAGES: Record<CurionaErrorCodes, string> = {
  [CurionaErrorCodes.INVALID_CREDENTIALS]:
    "The credentials you entered are incorrect. Please try again.",
  [CurionaErrorCodes.UNAUTHORIZED]:
    "You are not authorized to perform this action.",
  [CurionaErrorCodes.ACCOUNT_SUSPENDED]:
    "Your account has been suspended. Please contact support for assistance.",
  [CurionaErrorCodes.SIGNUP_DIFFERENT_METHOD]:
    "An account with this email already exists, but it uses a different sign-in method. Please try signing in with another method.",
  [CurionaErrorCodes.SESSION_EXPIRED]:
    "Your session has expired. Please sign in again.",
  [CurionaErrorCodes.SESSION_BLOCKED]:
    "Your session has been blocked. Please sign in again.",
  [CurionaErrorCodes.NOT_FOUND]: "The requested resource was not found.",
  [CurionaErrorCodes.DUPLICATE_DATA]: "The data you provided already exists.",
  [CurionaErrorCodes.INVALID_DATA]: "Invalid data provided.",
  [CurionaErrorCodes.VALIDATION_ERROR]:
    "There was an issue with the data you provided. Please check and try again.",
  [CurionaErrorCodes.INTERNAL_ERROR]:
    "Oops! We encountered an unexpected error. Please try again.",
  [CurionaErrorCodes.LLM_PROVIDER_UNAVAILABLE]:
    "Oops! Looks like our LLM provider is currently unavailable. Please try again later.",
  [CurionaErrorCodes.LLM_PROMPT_GENERATION_FAILED]:
    "Oops! We encountered an unexpected error while generating the prompt for you. Please try again later.",
  [CurionaErrorCodes.LLM_INVALID_DATA]:
    "There was an issue with the data you provided. Please check and try again.",
};

export class CurionaError extends Error {
  public code: CurionaErrorCodes;
  public statusCode: number = 500;
  public errorMessage: string;

  constructor(code: CurionaErrorCodes, message: string, statusCode = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.errorMessage = message;
  }
}

export function handleCurionaError(
  error: Error | AxiosError | CurionaError | unknown
): CurionaError {
  if (error instanceof CurionaError) {
    return error;
  }

  if (error instanceof AxiosError && error.response?.data) {
    const { code, message } = error.response.data;
    return new CurionaError(code, message, error.response.status);
  }

  if (error instanceof Error) {
    return new CurionaError(CurionaErrorCodes.INTERNAL_ERROR, error.message);
  }

  return new CurionaError(
    CurionaErrorCodes.INTERNAL_ERROR,
    ERROR_MESSAGES[CurionaErrorCodes.INTERNAL_ERROR]
  );
}
