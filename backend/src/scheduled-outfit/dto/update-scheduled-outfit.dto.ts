/**
 * DTO: UpdateScheduledOutfitDto
 *
 * Defines the payload structure for updating a scheduled outfit entry.
 * Primarily used to modify the date on which an outfit is scheduled.
 *
 * This DTO supports partial updates, allowing only the date field to be changed.
 */
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateScheduledOutfitDto {
  /**
   * The new date for the scheduled outfit, formatted in ISO 8601.
   * This field is optional and may be omitted if no update is required.
   *
   * Example: "2025-11-15"
   */
  @IsDateString()
  @IsOptional()
  schedule_date?: string;
}

/**
 * Preconditions:
 * - If provided, `schedule_date` must be a valid ISO 8601 date string.
 *
 * Postconditions:
 * - The existing scheduled outfit record is updated with the new date.
 */
