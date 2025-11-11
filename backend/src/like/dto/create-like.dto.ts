/**
 * ❤️ DTO: CreateLikeDto
 *
 * Defines and validates the structure of data required to create a new "like" entry.
 * This class ensures that a like action always includes valid user and outfit identifiers.
 *
 * 🔹 Purpose:
 * - To validate the request body when a user likes an outfit.
 * - To prevent invalid or incomplete like records from being processed by the controller or service.
 *
 * 🔹 Used In:
 * - `like.controller.ts` → for POST `/likes` requests.
 * - `like.service.ts` → to handle the creation and linking of likes in the database.
 *
 * 🔹 Validation Rules:
 * - `user_id` → must be a valid integer representing the liking user.
 * - `outfit_id` → must be a valid integer representing the liked outfit.
 *
 * 🔹 Preconditions:
 * - Both user and outfit must exist in the database.
 *
 * 🔹 Postconditions:
 * - A new like record is created linking the user and the outfit.
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateLikeDto {
  /**
   * 🧍 ID of the user who liked the outfit.
   * Must correspond to an existing user record.
   * @example 1
   */
  @ApiProperty({
    example: 1,
    description: 'Numeric ID of the user who liked the outfit',
  })
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  /**
   * 👗 ID of the outfit that received the like.
   * Must correspond to an existing outfit record.
   * @example 3
   */
  @ApiProperty({
    example: 3,
    description: 'Numeric ID of the outfit that was liked',
  })
  @IsInt()
  @IsNotEmpty()
  outfit_id: number;
}
