/**
 * 📝 DTO: UpdateCommentDto
 *
 * Defines the structure and validation rules for updating an existing comment.
 * This class allows partial updates — specifically modifying the text content of a comment.
 *
 * 🔹 Purpose:
 * - To validate input for PUT or PATCH requests when editing a comment.
 * - Ensures only string-type text can be updated, preventing invalid data types.
 *
 * 🔹 Used In:
 * - `comment.controller.ts` → for validating update requests.
 * - `comment.service.ts` → to safely update existing comment records in the database.
 *
 * 🔹 Validation Rules:
 * - `comment_text` → optional but must be a valid string if provided.
 *
 * 🔹 Preconditions:
 * - The comment being updated must exist in the database.
 *
 * 🔹 Postconditions:
 * - Returns a valid DTO that updates the `comment_text` field.
 */

import { IsString, IsOptional } from 'class-validator';

export class UpdateCommentDto {
  /**
   * 💬 The new text for the comment.
   * Optional — only provided when the user edits the comment.
   * @example "Actually, I think this outfit would look better with a white jacket!"
   */
  @IsString()
  @IsOptional()
  comment_text?: string;
}
