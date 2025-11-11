/**
 * Controller: TagsController
 *
 * Handles HTTP requests for managing user-defined tags.
 * Supports creation, retrieval, updating, and deletion of tags.
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly service: TagsService) {}

  // ---------- GET ALL ----------
  /**
   * Retrieves all existing tags from the database.
   *
   * Postconditions:
   * - Returns an array of `Tag` entities with associated user references.
   */
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // ---------- GET ONE ----------
  /**
   * Retrieves a single tag by its unique ID.
   *
   * @param id - The ID of the tag to fetch.
   * Preconditions:
   * - The tag must exist in the database.
   *
   * Postconditions:
   * - Returns the tag details or throws `NotFoundException` if not found.
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // ---------- POST ----------
  /**
   * Creates a new tag for a specific user.
   *
   * @param dto - The data for the new tag, including `name` and `user_id`.
   * Preconditions:
   * - Both `name` and `user_id` must be provided.
   * - The user referenced by `user_id` must exist.
   *
   * Postconditions:
   * - A new tag record is persisted and associated with the user.
   */
  @Post()
  create(@Body() dto: CreateTagDto) {
    if (!dto.name || !dto.user_id) {
      throw new BadRequestException('Missing name or user_id');
    }
    return this.service.create(dto);
  }

  // ---------- PUT ----------
  /**
   * Updates an existing tag’s details.
   *
   * @param id - The ID of the tag to update.
   * @param dto - The fields to update (partial).
   *
   * Postconditions:
   * - Only provided fields are updated; others remain unchanged.
   */
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTagDto) {
    return this.service.update(id, dto);
  }

  // ---------- DELETE ----------
  /**
   * Deletes a tag permanently.
   *
   * @param id - The ID of the tag to delete.
   *
   * Postconditions:
   * - The tag is removed from the database.
   * - Throws `NotFoundException` if the tag does not exist.
   */
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
