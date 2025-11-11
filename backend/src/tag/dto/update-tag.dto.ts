/**
 * DTO: UpdateTagDto
 *
 * Extends `CreateTagDto` to allow partial updates of existing tags.
 * This enables editing fields such as the tag name or ownership
 * without requiring all fields to be re-submitted.
 */
import { PartialType } from '@nestjs/mapped-types';
import { CreateTagDto } from './create-tag.dto';

export class UpdateTagDto extends PartialType(CreateTagDto) {}

/**
 * Preconditions:
 * - The referenced tag must already exist in the database.
 *
 * Postconditions:
 * - Only provided fields are updated; unspecified fields remain unchanged.
 */
