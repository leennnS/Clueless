import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserInput } from '../user/dto/create-user.dto';
import { LoginInput } from '../user/dto/login.dto';
import { ForgotPasswordInput } from '../user/dto/forgot-password.dto';
import { ResetPasswordInput } from '../user/dto/reset-password.dto';
import {
  AuthPayload,
  MessagePayload,
  PasswordResetRequestPayload,
  UserPayload,
} from '../user/user.types';
import { User } from '../user/user.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  register(input: CreateUserInput): Promise<UserPayload> {
    return this.userService.register(input);
  }

  login(input: LoginInput): Promise<AuthPayload> {
    return this.userService.login(input);
  }

  requestPasswordReset(input: ForgotPasswordInput): Promise<PasswordResetRequestPayload> {
    return this.userService.requestPasswordReset(input);
  }

  resetPassword(input: ResetPasswordInput): Promise<MessagePayload> {
    return this.userService.resetPassword(input);
  }

  async me(req: any): Promise<User> {
    const token = this.extractToken(req);
    if (!token) {
      throw new UnauthorizedException('Missing authorization token');
    }

    const secret = this.getJwtSecret();
    let payload: any;
    try {
      payload = jwt.verify(token, secret) as { id: number };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return this.userService.getUserById(payload.id);
  }

  private extractToken(req: any): string | null {
    const authHeader = req?.headers?.authorization ?? '';
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
    return null;
  }

  private getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new InternalServerErrorException('JWT_SECRET environment variable is not configured.');
    }
    return secret;
  }
}
