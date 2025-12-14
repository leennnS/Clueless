/**
 * Module: ScheduledOutfitModule
 *
 * This module bundles all components related to outfit scheduling functionality.
 * It handles the registration of the `ScheduledOutfit` entity, its service, and controller.
 *
 * Responsibilities:
 * - Provides CRUD operations for scheduling outfits.
 * - Connects users with outfits assigned to specific dates.
 * - Integrates with `User` and `Outfit` entities to enforce relational consistency.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduledOutfit } from './scheduled-outfit.entity';
import { ScheduledOutfitService } from './scheduled-outfit.service';
import { User } from '../user/user.entity';
import { Outfit } from '../outfit/outfit.entity';
import { ScheduledOutfitResolver } from './scheduled-outfit.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ScheduledOutfit, User, Outfit])],
  providers: [ScheduledOutfitService, ScheduledOutfitResolver],
})
export class ScheduledOutfitModule {}

/**
 * Preconditions:
 * - The `User` and `Outfit` entities must be properly registered in the application’s ORM configuration.
 *
 * Postconditions:
 * - The `ScheduledOutfitService` and `ScheduledOutfitController` become available for dependency injection and API routing.
 */
