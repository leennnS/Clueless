/**
 * Module: UserModule
 *
 * Manages all user-related functionality, including authentication,
 * registration, profile management, and password reset workflows.
 *
 * Integrates the `User` and `PasswordResetToken` entities with TypeORM,
 * providing the required repositories for the `UserService` and 
 * exposing the corresponding `UserController` endpoints.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { PasswordResetToken } from './password-reset-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PasswordResetToken])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
