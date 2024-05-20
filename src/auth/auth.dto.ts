import { z } from 'zod';
import { CreateUserDtoValidator, PasswordValidator } from '../user/user.dto';

export const TokenDtoValidator = z.object({
  token: z.string(),
});
export type TokenDto = z.infer<typeof TokenDtoValidator>;

export const LoginDtoValidator = z.object({
  email: z.string().email(),
  password: PasswordValidator,
});

export const RegisterDtoValidator = CreateUserDtoValidator;
