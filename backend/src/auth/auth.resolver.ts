import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
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

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => UserPayload)
  register(@Args('createUserInput') createUserInput: CreateUserInput): Promise<UserPayload> {
    return this.authService.register(createUserInput);
  }

  @Mutation(() => AuthPayload)
  login(@Args('loginInput') loginInput: LoginInput): Promise<AuthPayload> {
    return this.authService.login(loginInput);
  }

  @Mutation(() => PasswordResetRequestPayload)
  requestPasswordReset(
    @Args('forgotPasswordInput') forgotPasswordInput: ForgotPasswordInput,
  ): Promise<PasswordResetRequestPayload> {
    return this.authService.requestPasswordReset(forgotPasswordInput);
  }

  @Mutation(() => MessagePayload)
  resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
  ): Promise<MessagePayload> {
    return this.authService.resetPassword(resetPasswordInput);
  }

  @Query(() => User, { name: 'me' })
  me(@Context() context: any): Promise<User> {
    return this.authService.me(context.req);
  }
}
