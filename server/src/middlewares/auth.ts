import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/exception";
import { verifyToken } from "../helper/auth";
import { JsonWebTokenError } from "jsonwebtoken";

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new HttpException(401, "Unauthenticated request");
    }
    const userId = verifyToken(token);
    req.body.userId = userId;
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      next(new HttpException(401, "Unauthenticated request"));
    }
    next(error);
  }
}

export { authMiddleware };
