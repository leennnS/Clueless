import { Field, InputType, Int } from '@nestjs/graphql';
import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateScheduledOutfitInput {
  /**
   * The ID of the outfit being scheduled.
   *
   * Example: 12
   */
  @Field(() => Int)
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  outfit_id: number;

  /**
   * The ID of the user who owns or schedules the outfit.
   *
   * Example: 5
   */
  @Field(() => Int)
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  /**
   * The date when the outfit is scheduled to be worn or activated.
   *
   * Must be provided in ISO format (YYYY-MM-DD or full timestamp).
   * Example: "2025-10-29"
   */
  @Field()
  @IsDateString()
  @IsNotEmpty()
  schedule_date: string;
}
