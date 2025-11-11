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
 * - Exposes the `OutfitController` for handling REST API endpoints.
 * - Exports both the TypeORM repository and service for reuse in other modules.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outfit } from './outfit.entity';
import { OutfitService } from './outfit.service';
import { OutfitController } from './outfit.controller';

@Module({
  /** Imports the Outfit entity to enable repository injection. */
  imports: [TypeOrmModule.forFeature([Outfit])],

  /** Registers the service responsible for outfit business logic. */
  providers: [OutfitService],

  /** Exposes REST API endpoints for outfits via the controller. */
  controllers: [OutfitController],

  /** Makes the service and repository available to other modules. */
  exports: [TypeOrmModule, OutfitService],
})
export class OutfitModule {}
