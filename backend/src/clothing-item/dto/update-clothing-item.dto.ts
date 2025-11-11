/**
 * 📘 Data Transfer Object: UpdateClothingItemDto
 *
 * Represents the structure used when updating an existing clothing item.
 * This DTO ensures that all modifications to clothing records are
 * validated before being applied to the database.
 *
 * 🔹 Used In:
 * - ClothingItemController → `PATCH /clothing-items/:id`
 * - ClothingItemService → `update()`
 *
 * 🔹 Responsibilities:
 * - Define which fields can be updated.
 * - Allow partial updates (all fields optional).
 * - Maintain validation and Swagger documentation consistency.
 *
 * 🔹 Validation:
 * Uses `class-validator` to ensure that only valid data types
 * (string/number) are accepted when performing updates.
 *
 * 🔹 Related Entity:
 * - ClothingItem
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateClothingItemDto {
  /**
   * Updated name for the clothing item.
   * Optional — only include if changing the name.
   * @example "Blue Denim Jacket"
   */
  @ApiPropertyOptional({
    example: 'Blue Denim Jacket',
    description: 'Updated name of the clothing item',
  })
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * Updated category or type of the clothing item.
   * Optional field.
   * @example "Jackets"
   */
  @ApiPropertyOptional({
    example: 'Jackets',
    description: 'Updated category or type of clothing',
  })
  @IsOptional()
  @IsString()
  category?: string;

  /**
   * Updated color value for the item.
   * Optional field.
   * @example "Blue"
   */
  @ApiPropertyOptional({
    example: 'Blue',
    description: 'Updated color of the item',
  })
  @IsOptional()
  @IsString()
  color?: string;

  /**
   * New image URL for the clothing item.
   * Used when updating the visual representation of the piece.
   * @example "https://example.com/images/jacket-new.jpg"
   */
  @ApiPropertyOptional({
    example: 'https://example.com/images/jacket-new.jpg',
    description: 'Updated image URL for the clothing item',
  })
  @IsOptional()
  @IsString()
  image_url?: string;

  /**
   * Updated user ID if transferring ownership to another account.
   * Should correspond to a valid user record.
   * @example 1
   */
  @ApiPropertyOptional({
    example: 1,
    description: 'User ID (if changing ownership)',
  })
  @IsOptional()
  @IsNumber()
  user_id?: number;
}
