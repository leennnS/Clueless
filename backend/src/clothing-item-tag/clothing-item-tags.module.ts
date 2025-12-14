/**
 * 🧩 Module: ClothingItemTagsModule
 *
 * Integrates all components related to the management of the relationship
 * between `ClothingItem` and `Tag` entities.
 *
 * 🔹 Purpose:
 * - Organizes the `clothing_item_tags` feature into a cohesive NestJS module.
 * - Registers the entity, service, and controller within the dependency
 *   injection (DI) system.
 *
 * 🔹 Responsibilities:
 * - Provide CRUD endpoints for managing item–tag associations.
 * - Export the `ClothingItemTagsService` for use in other modules (e.g. when
 *   handling item creation or tag synchronization).
 *
 * 🔹 Imports:
 * - `TypeOrmModule.forFeature([ClothingItemTag])` → Makes the entity repository
 *   available for dependency injection in this module’s providers.
 *
 * 🔹 Exports:
 * - `ClothingItemTagsService` → Enables other modules to access its methods.
 *
 * 🔹 Related Components:
 * - `clothing-item-tag.entity.ts` → Database mapping.
 * - `clothing-item-tags.service.ts` → Business logic layer.
 * - `clothing-item-tags.controller.ts` → REST API endpoints.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClothingItemTag } from './clothing-item-tag.entity';
import { ClothingItemTagsService } from './clothing-item-tags.service';
import { ClothingItemTagResolver } from './clothing-item-tags.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ClothingItemTag])],
  controllers: [],
  providers: [ClothingItemTagsService, ClothingItemTagResolver],
  exports: [ClothingItemTagsService],
})
export class ClothingItemTagsModule {}
