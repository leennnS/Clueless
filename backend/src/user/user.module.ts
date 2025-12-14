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
import { User } from './user.entity';
import { PasswordResetToken } from './password-reset-token.entity';
import { UserResolver } from './user.resolver';
import { ClothingItem } from '../clothing-item/clothing-item.entity';
import { Outfit } from '../outfit/outfit.entity';
import { OutfitItem } from '../outfit-item/outfit-item.entity';
import { ScheduledOutfit } from '../scheduled-outfit/scheduled-outfit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      PasswordResetToken,
      ClothingItem,
      Outfit,
      OutfitItem,
      ScheduledOutfit,
    ]),
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
