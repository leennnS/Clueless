/**
 * 👗 Data Transfer Object: CreateOutfitDto
 *
 * Defines the structure and validation rules for creating a new outfit.
 * This DTO ensures that the incoming request body meets the expected
 * format and type safety before reaching the OutfitService or database layer.
 *
 * 🔹 Purpose:
 * - Validate outfit creation payloads.
 * - Support optional properties (name, visibility, image).
 * - Enforce URL or Base64 constraints for image uploads.
 *
 * 🔹 Related Components:
 * - `outfit.entity.ts` → Database schema for outfits.
 * - `outfit.controller.ts` → Handles HTTP routes.
 * - `outfit.service.ts` → Applies business logic.
 *
 * 🔹 Dependencies:
 * - `class-validator` for input validation decorators.
 * - `class-transformer` for type conversion.
 *
 * 🔹 Preconditions:
 * - If provided, `cover_image_url` must be a valid HTTP(S) URL or Base64-encoded image string.
 * - `user_id` should reference an existing user in the system.
 *
 * 🔹 Postconditions:
 * - Validated DTO object is passed to the service for persistence.
 */

import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Regex pattern allowing either:
 * - A valid HTTP(S) image URL.
 * - A Base64-encoded inline image (PNG or JPEG).
 *
 * Example valid formats:
 *   ✅ https://example.com/outfits/look1.jpg
 *   ✅ data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA...
 */
const COVER_IMAGE_REGEX =
  /^(https?:\/\/.+|data:image\/(?:png|jpe?g);base64,[a-z0-9+/=]+)$/i;

export class CreateOutfitDto {
  /**
   * Optional name or label of the outfit (e.g. "Summer Vibes").
   *
   * @example "Cozy Winter Layers"
   * @optional
   */
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * Determines whether the outfit is public (visible to other users)
   * or private (visible only to its creator).
   *
   * @example true
   * @default false
   * @optional
   */
  @IsOptional()
  @IsBoolean()
  is_public?: boolean;

  /**
   * Optional image representing the outfit cover.
   * Accepts either a URL or a base64-encoded image string.
   *
   * @example "https://cdn.example.com/outfits/123.jpg"
   * @example "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA..."
   * @optional
   */
  @IsOptional()
  @IsString()
  @Matches(COVER_IMAGE_REGEX, {
    message: 'cover_image_url must be an http(s) URL or base64 data URI',
  })
  cover_image_url?: string | null;

  /**
   * Numeric identifier of the user who owns or creates the outfit.
   *
   * @example 42
   * @optional
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  user_id?: number;
}
