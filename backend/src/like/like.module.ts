/**
 * ❤️ Module: LikesModule
 *
 * Integrates all components related to the "like" feature, which allows users
 * to like and unlike outfits. This module ties together the entity,
 * controller, and service layers for managing likes.
 *
 * 🔹 Purpose:
 * - Provide endpoints and logic for liking and unliking outfits.
 * - Register the `Like` entity for ORM integration.
 * - Expose `LikesService` for use in other modules (e.g., outfit reports or notifications).
 *
 * 🔹 Responsibilities:
 * - Manage dependencies between the controller, service, and entity.
 * - Serve as a self-contained unit for all "like" functionality.
 *
 * 🔹 Imports:
 * - `TypeOrmModule.forFeature([Like])` → Registers the Like entity’s repository
 *   for dependency injection within this module.
 *
 * 🔹 Controllers:
 * - `LikesController` → Handles API routes (`/likes`) for like interactions.
 *
 * 🔹 Providers:
 * - `LikesService` → Contains business logic for creating, toggling, and deleting likes.
 *
 * 🔹 Exports:
 * - `LikesService` → Makes service methods reusable in other modules (e.g., for analytics or feeds).
 *
 * 🔹 Related Files:
 * - `like.entity.ts` → Database schema for like records.
 * - `like.controller.ts` → REST endpoints for liking/unliking outfits.
 * - `like.service.ts` → Business logic for managing likes.
 * - `create-like.dto.ts`, `delete-like.dto.ts` → Request validation DTOs.
 *
 * 🔹 Preconditions:
 * - Users and outfits must exist before likes can be created.
 *
 * 🔹 Postconditions:
 * - Like actions are stored, retrieved, or toggled persistently in the database.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { LikesService } from './like.service';
import { LikesController } from './like.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Like])],
  controllers: [LikesController],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
