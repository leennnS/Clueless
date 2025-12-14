/**
 * Module: OutfitModule
 *
 * Provides the outfit management feature of the application.
 * This module encapsulates all functionality related to user-created outfits,
 * including creation, retrieval, updates, deletion, and integration with
 * related entities such as outfit items, comments, likes, and schedules.
 *
 * Responsibilities:
 * - Registers the `Outfit` entity for database interaction through TypeORM.
 * - Provides the `OutfitService` for business logic and data operations.
 * - Exposes GraphQL resolver for outfit operations.
 * - Exports both the TypeORM repository and service for reuse in other modules.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outfit } from './outfit.entity';
import { OutfitService } from './outfit.service';
import { OutfitResolver } from './outfit.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Outfit])],
  providers: [OutfitService, OutfitResolver],
  controllers: [],
  exports: [TypeOrmModule, OutfitService],
})
export class OutfitModule {}
