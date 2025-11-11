/**
 * 💔 DTO: DeleteLikeDto
 *
 * Defines and validates the data required to remove (unlike) a previously liked outfit.
 * This ensures that the backend receives valid user and outfit identifiers
 * before deleting the corresponding like record.
 *
 * 🔹 Purpose:
 * - Used to safely identify which like entry to remove from the database.
 * - Prevents invalid or incomplete delete operations.
 *
 * 🔹 Used In:
 * - `like.controller.ts` → for DELETE `/likes` requests.
 * - `like.service.ts` → to locate and remove an existing like record.
 *
 * 🔹 Validation Rules:
 * - `user_id` → must be a valid integer referencing an existing user.
 * - `outfit_id` → must be a valid integer referencing an existing outfit.
 *
 * 🔹 Preconditions:
 * - A like between the given user and outfit must exist in the database.
 *
 * 🔹 Postconditions:
 * - The like record is successfully removed.
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class DeleteLikeDto {
  /**
   * 🧍 ID of the user unliking the outfit.
   * Must correspond to a valid existing user.
   * @example 1
   */
  @ApiProperty({
    example: 1,
    description: 'Numeric ID of the user removing their like',
  })
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  /**
   * 👗 ID of the outfit being unliked.
   * Must correspond to a valid existing outfit.
   * @example 3
   */
  @ApiProperty({
    example: 3,
    description: 'Numeric ID of the outfit being unliked',
  })
  @IsInt()
  @IsNotEmpty()
  outfit_id: number;
}
