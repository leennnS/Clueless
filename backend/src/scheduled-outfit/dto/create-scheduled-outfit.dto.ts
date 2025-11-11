/**
 * DTO: CreateScheduledOutfitDto
 *
 * Represents the payload structure required to schedule an outfit
 * for a specific user on a specific date.
 *
 * This DTO ensures that only valid outfit IDs, user IDs, and ISO-formatted
 * schedule dates are accepted by the backend before persisting the record.
 */
import { IsInt, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateScheduledOutfitDto {
  /**
   * The ID of the outfit being scheduled.
   *
   * Example: 12
   */
  @IsInt()
  @IsNotEmpty()
  outfit_id: number;

  /**
   * The ID of the user who owns or schedules the outfit.
   *
   * Example: 5
   */
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  /**
   * The date when the outfit is scheduled to be worn or activated.
   *
   * Must be provided in ISO format (YYYY-MM-DD or full timestamp).
   * Example: "2025-10-29"
   */
  @IsDateString()
  @IsNotEmpty()
  schedule_date: string;
}

/**
 * Preconditions:
 * - Both `outfit_id` and `user_id` must reference existing entities.
 * - `schedule_date` must be a valid ISO 8601 date string.
 *
 * Postconditions:
 * - The validated data can safely be persisted as a new scheduled outfit entry.
 */
