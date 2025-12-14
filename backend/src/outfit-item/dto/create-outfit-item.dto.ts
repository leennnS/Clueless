/**
 * DTO: CreateOutfitItemDto
 *
 * Represents the payload structure for adding a clothing item to an outfit.
 * Used to define how each item appears on the outfit canvas — including
 * its position, stacking order, and optional transformation properties.
 *
 * This class is validated automatically via class-validator and annotated
 * for Swagger API documentation.
 */
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional } from 'class-validator';

@InputType()
export class CreateOutfitItemInput {
  @Field(() => Int)
  @IsInt()
  outfit_id: number;

  @Field(() => Int)
  @IsInt()
  item_id: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  x_position?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  y_position?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  z_index?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  transform?: string;
}

/**
 * Preconditions:
 * - `outfit_id` and `item_id` must correspond to valid records in the database.
 * - All position and transformation fields are optional but must be valid if provided.
 *
 * Postconditions:
 * - The validated object can be safely used by the service layer to attach
 *   the item to an outfit and persist it with its visual layout data.
 */
