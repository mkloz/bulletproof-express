import { Request, Response } from 'express';
import {
  LoginDtoValidator,
  RegisterDtoValidator,
  TokenDtoValidator,
} from './auth.dto';
import { UserService, userService } from '../user/user.service';
import {
  ConflictException,
  UnprocessableEntityException,
} from '../utils/exeptions/exeptions';
import { jwtService } from './jwt/jwt.service';
import { StatusCodes } from 'http-status-codes';

export class AuthController {
  public static async login(req: Request, res: Response) {
    const dto = LoginDtoValidator.parse(req.body);
    const user = await userService.get({ email: dto.email });

    if (!user || !UserService.compare(dto.password, user.password || '')) {
      throw new UnprocessableEntityException('Invalid data provided');
    }

    const tokens = jwtService.generateTokens({ userId: user.id });

    res.status(StatusCodes.OK).json(tokens);
  }

  public static async register(req: Request, res: Response) {
    const dto = RegisterDtoValidator.parse(req.body);
    const userFromDB = await userService.getSafe({ email: dto.email });

    if (userFromDB) {
      throw new ConflictException('User already registered');
    }
    const user = await userService.create(dto);
    const tokens = jwtService.generateTokens({ userId: user.id });

    res.status(StatusCodes.CREATED).json(tokens);
  }

  public static async refresh(req: Request, res: Response) {
    const dto = TokenDtoValidator.parse(req.body);
    const { userId } = jwtService.decodeRefreshToken(dto.token);
    const tokens = jwtService.generateTokens({ userId });

    res.status(StatusCodes.OK).json(tokens);
  }
}
