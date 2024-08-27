import { NextFunction, Request, Response } from 'express';

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

export interface ErrorResponseForTest {
  status: string;
  msg: string;
  data: any | null;
}

