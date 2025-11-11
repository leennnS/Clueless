/**
 * 📘 Data Transfer Object: CreateClothingItemDto
 *
 * Represents the data structure required to create a new clothing item
 * within the wardrobe system. This DTO ensures that incoming requests
 * from the client contain all necessary fields with proper validation
 * before reaching the service or database layers.
 *
 * 🔹 Used In:
 * - ClothingItemController → `POST /clothing-items`
 * - ClothingItemService → `create()`
 *
 * 🔹 Responsibilities:
 * - Validate request data before insertion.
 * - Provide API documentation metadata for Swagger.
 * - Enforce data integrity between frontend and backend.
 *
 * 🔹 Validation:
 * Utilizes `class-validator` decorators to ensure type safety and required fields.
 *
 * 🔹 Related Entities:
 * - ClothingItem
 * - Tag
 * - User
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateClothingItemDto {
  /**
   * The display name of the clothing item.
   * @example "Blue Denim Jacket"
   * @remarks Must be a non-empty string.
   */
  @ApiProperty({
    example: 'Blue Denim Jacket',
    description: 'Name of the clothing item',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * The main category or clothing type.
   * @example "Jackets"
   * @remarks Must be a non-empty string such as "Shirts", "Pants", etc.
   */
  @ApiProperty({
    example: 'Jackets',
    description: 'Category or type of clothing',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  /**
   * The color description of the clothing item.
   * Optional field.
   * @example "Blue"
   */
  @ApiProperty({
    example: 'Blue',
    required: false,
    description: 'Color of the item',
  })
  @IsOptional()
  @IsString()
  color?: string;

  /**
   * The URL of the uploaded image for this clothing item.
   * Optional field.
   * @example "https://example.com/images/jacket.jpg"
   */
  @ApiProperty({
    example: 'https://example.com/images/jacket.jpg',
    required: false,
    description: 'URL of the clothing item image',
  })
  @IsOptional()
  @IsString()
  image_url?: string;

  /**
   * The ID of the user who owns this clothing item.
   * @example 1
   * @remarks This field must match an existing user in the database.
   */
  @ApiProperty({ example: 1, description: 'ID of the user who owns this item' })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  /**
   * Optional list of existing tag IDs to associate with this item.
   * @example [1, 2]
   */
  @ApiProperty({
    example: [1, 2],
    required: false,
    description: 'IDs of tags to associate with this clothing item',
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  tag_ids?: number[];

  /**
   * Optional list of new tag names to associate with this item.
   * Used when tags are provided by name instead of ID.
   * @example ["summer", "lightweight"]
   */
  @ApiProperty({
    example: ['summer', 'lightweight'],
    required: false,
    description: 'Preset tag names to associate with this clothing item',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tag_names?: string[];
}
