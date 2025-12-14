/**
 * 🧩 Module: ClothingItemModule
 *
 * Represents the wardrobe (clothing item) feature module within the application.
 * This module bundles together all related components — entity definitions,
 * service logic, and controller routes — for managing clothing items.
 *
 * 🔹 Purpose:
 * - Encapsulate all wardrobe-related logic and database operations.
 * - Register related entities (`ClothingItem`, `ClothingItemTag`, `Tag`) for TypeORM.
 * - Provide the `ClothingItemService` to other modules via export.
 *
 * 🔹 Imported Entities:
 * - `ClothingItem` → main entity representing wardrobe items.
 * - `ClothingItemTag` → junction entity linking clothing items and tags.
 * - `Tag` → entity representing available tag metadata.
 *
 * 🔹 Components:
 * - **Controller:** `ClothingItemController`
 * - **Service:** `ClothingItemService`
 *
 * 🔹 Integration:
 * This module is imported by the root `AppModule` and can also be reused
 * by other modules (e.g., `OutfitModule`) via its exported service.
 *
 * 🔹 Precondition:
 * - The TypeORM connection must be initialized.
 *
 * 🔹 Postcondition:
 * - The application can perform all CRUD operations for clothing items.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClothingItem } from './clothing-item.entity';
import { ClothingItemTag } from '../clothing-item-tag/clothing-item-tag.entity';
import { Tag } from '../tag/tag.entity';
import { ClothingItemService } from './clothing-item.service';
import { ClothingItemResolver } from './clothing-item.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ClothingItem, ClothingItemTag, Tag])],
  providers: [ClothingItemService, ClothingItemResolver],
  exports: [ClothingItemService],
})
export class ClothingItemModule {}
