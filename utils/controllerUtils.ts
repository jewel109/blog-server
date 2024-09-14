import { NextFunction, Request, Response } from 'express';
import { createDefaultResponse } from '../core/app/repository/repoUtils';

interface ResponsePayload {
  statusCode?: number;
  status?: "error" | "success";
  msg: string;
  data?: any;
}

export function sendResponse(res: Response, { statusCode = 404, status = "error", msg, data = null }: ResponsePayload) {
  return res.status(statusCode).json({
    status,
    msg,
    data,
  });
}
export type Handler<T extends Request = Request> = (req: T, res: Response, next: NextFunction) => void | Promise<void | Response>;

export const withRequest = <T extends Request>(handler: Handler<T>) => {
  return (req: T, res: Response, next: NextFunction) => {
    return handler(req, res, next);
  };
};

export interface ResponseForTest {
  status: string;
  msg: string;
  data: any | null;
}

type Result<T> =
  | { success: true; data: T }
  | { success: false; error: Error };

export function tcWrapper<T, A extends any[], R>(
  f: (this: T, ...args: A) => R
): (this: T, ...args: A) => Result<R> {
  return function (this: T, ...args: A): Result<R> {
    try {
      const data = f.apply(this, args);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  };
}
