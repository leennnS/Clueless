/**
 * 🧾 Data Transfer Object: CreateClothingItemTagDto
 *
 * Defines the structure for creating a relationship between a clothing item
 * and a tag. Each record represents a single association in the
 * `clothing_item_tags` junction table.
 *
 * 🔹 Purpose:
 * - Link an existing `ClothingItem` with an existing `Tag`.
 * - Maintain a many-to-many relationship through the `ClothingItemTag` entity.
 *
 * 🔹 Used In:
 * - ClothingItemTagController → `POST /clothing-item-tags`
 * - ClothingItemService (internally during outfit or tag assignment)
 *
 * 🔹 Validation:
 * - Both `item_id` and `tag_id` must be valid integers.
 * - Each pair must reference existing records in their respective tables.
 *
 * 🔹 Preconditions:
 * - The referenced `ClothingItem` and `Tag` must already exist.
 *
 * 🔹 Postconditions:
 * - A new association is created in the `clothing_item_tags` table.
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateClothingItemTagDto {
  /**
   * 🧥 The unique identifier of the clothing item being tagged.
   * Must correspond to an existing `ClothingItem` record.
   * @example 5
   */
  @ApiProperty({ example: 5, description: 'ID of the clothing item' })
  @IsInt()
  @IsNotEmpty()
  item_id: number;

  /**
   * 🔖 The unique identifier of the tag to associate.
   * Must correspond to an existing `Tag` record.
   * @example 2
   */
  @ApiProperty({ example: 2, description: 'ID of the tag' })
  @IsInt()
  @IsNotEmpty()
  tag_id: number;
}
