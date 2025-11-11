/**
 * 🗒️ DTO: CreateCommentDto
 *
 * Defines and validates the structure of data required to create a new comment.
 * This class ensures that all necessary fields (user ID, outfit ID, and comment text)
 * are provided and correctly typed before being processed by the controller or service.
 *
 * 🔹 Purpose:
 * - To validate incoming request bodies for comment creation.
 * - To enforce correct data types and required fields using class-validator decorators.
 *
 * 🔹 Used In:
 * - `comment.controller.ts` → for validating POST /comments requests.
 * - `comment.service.ts` → to safely create a comment entity in the database.
 *
 * 🔹 Validation Rules:
 * - `user_id` → must be an integer and not empty.
 * - `outfit_id` → must be an integer and not empty.
 * - `comment_text` → must be a non-empty string.
 *
 * 🔹 Preconditions:
 * - The `user_id` and `outfit_id` must reference existing records.
 *
 * 🔹 Postconditions:
 * - Returns a valid DTO instance to be used for comment creation logic.
 */

import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  /** 
   * 🧍 ID of the user posting the comment. 
   * Must correspond to an existing user record.
   * @example 5 
   */
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  /** 
   * 🎬 ID of the outfit being commented on.
   * Must reference a valid outfit record.
   * @example 12 
   */
  @IsInt()
  @IsNotEmpty()
  outfit_id: number;

  /** 
   * 💬 The textual content of the comment.
   * Cannot be empty or contain only whitespace.
   * @example "Love this outfit! The colors go perfectly together." 
   */
  @IsString()
  @IsNotEmpty()
  comment_text: string;
}
