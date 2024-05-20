import { NextFunction, Request, Response } from 'express';
import { JwtAuthService, jwtService } from './jwt/jwt.service';
import { JwtAuthPayload } from './jwt/jwt-payload.dto';

export function auth(req: Request, res: Response, next: NextFunction) {
  parseAuthToken(req);
  next();
}

export function parseAuthToken(req: Request): JwtAuthPayload {
  const token = JwtAuthService.extractJwtToken(req);

  return jwtService.decodeAccessToken(token);
}
