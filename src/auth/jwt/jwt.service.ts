import jwt from 'jsonwebtoken';
import { ApiConfigService, IJWTConfig } from '../../config/api-config.service';
import { Tokens } from './tokens.dto';
import { JwtAuthPayload, JwtAuthPayloadValidator } from './jwt-payload.dto';
import { Request } from 'express';
import { UnauthorizedException } from '../../utils/exeptions/exeptions';

export class JwtAuthService {
  constructor(private readonly jwtConfig: IJWTConfig) {}

  public static generateToken = jwt.sign;
  public static verifyToken = jwt.verify;

  private generateAccessToken(payload: JwtAuthPayload): string {
    return JwtAuthService.generateToken(
      payload,
      this.jwtConfig.accessToken.secret,
      {
        expiresIn: this.jwtConfig.accessToken.time,
      },
    );
  }

  private generateRefreshToken(payload: JwtAuthPayload): string {
    return JwtAuthService.generateToken(
      payload,
      this.jwtConfig.refreshToken.secret,
      {
        expiresIn: this.jwtConfig.refreshToken.time,
      },
    );
  }

  public generateTokens(payload: JwtAuthPayload): Tokens {
    return new Tokens(
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    );
  }

  public decodeAccessToken(token: string): JwtAuthPayload {
    let payload;

    try {
      payload = JwtAuthService.verifyToken(
        token,
        this.jwtConfig.accessToken.secret,
      );
    } catch (error) {
      throw new UnauthorizedException('Invalid token provided');
    }

    return JwtAuthPayloadValidator.parse(payload);
  }

  public decodeRefreshToken(token: string): JwtAuthPayload {
    let payload;

    try {
      payload = JwtAuthService.verifyToken(
        token,
        this.jwtConfig.accessToken.secret,
      );
    } catch (error) {
      throw new UnauthorizedException('Invalid token provided');
    }

    return JwtAuthPayloadValidator.parse(payload);
  }

  public static extractJwtToken(req: Request): string {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    return token;
  }
}

export const jwtService = new JwtAuthService(
  new ApiConfigService().getConfig().jwt,
);
