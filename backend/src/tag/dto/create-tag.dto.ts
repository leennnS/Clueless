/**
 * DTO: CreateTagDto
 *
 * Defines the required structure for creating a new tag.
 * Tags are user-defined labels that help categorize or filter clothing items.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateTagDto {
  /** 
   * The name of the tag (e.g., “Summer”, “Formal”, “Casual”).
   * Used for quick filtering and grouping of wardrobe items.
   */
  @ApiProperty({ example: 'Summer', description: 'Name of the tag' })
  @IsString()
  @IsNotEmpty()
  name: string;

  /**
   * The ID of the user who owns or created this tag.
   * Ensures tags are scoped per user.
   */
  @ApiProperty({ example: 1, description: 'ID of the user who owns the tag' })
  @IsInt()
  @IsNotEmpty()
  user_id: number;
}

/**
 * Preconditions:
 * - The provided user_id must correspond to an existing user.
 *
 * Postconditions:
 * - A valid Tag entity can be created and linked to the user’s wardrobe.
 */
