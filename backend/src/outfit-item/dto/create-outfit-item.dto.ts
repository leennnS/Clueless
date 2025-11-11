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
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsObject } from 'class-validator';

export class CreateOutfitItemDto {
  @ApiProperty({
    example: 3,
    description: 'Unique ID of the outfit this item belongs to.',
  })
  @IsInt()
  outfit_id: number;

  @ApiProperty({
    example: 7,
    description: 'Unique ID of the clothing item being added to the outfit.',
  })
  @IsInt()
  item_id: number;

  @ApiProperty({
    example: 120,
    required: false,
    description: 'Horizontal (X-axis) position on the outfit canvas.',
  })
  @IsOptional()
  @IsInt()
  x_position?: number;

  @ApiProperty({
    example: 250,
    required: false,
    description: 'Vertical (Y-axis) position on the outfit canvas.',
  })
  @IsOptional()
  @IsInt()
  y_position?: number;

  @ApiProperty({
    example: 2,
    required: false,
    description: 'Z-index layer order that defines visual stacking.',
  })
  @IsOptional()
  @IsInt()
  z_index?: number;

  @ApiProperty({
    example: { scale: 1.1, rotation: 15 },
    required: false,
    description: 'Optional object describing transformations (scale, rotation, etc.).',
  })
  @IsOptional()
  @IsObject()
  transform?: Record<string, any>;
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
