/**
 * 💬 Controller: CommentController
 *
 * Manages all API endpoints related to comments on outfits.
 * This controller handles CRUD operations through the `CommentService`.
 *
 * 🔹 Base Route: `/comments`
 *
 * 🔹 Purpose:
 * - Allows users to add, read, update, and delete comments on outfits.
 * - Uses DTOs (`CreateCommentDto`, `UpdateCommentDto`) for input validation.
 *
 * 🔹 Related Components:
 * - `comment.service.ts` → Business logic layer.
 * - `comment.entity.ts` → Database mapping.
 * - `create-comment.dto.ts` / `update-comment.dto.ts` → Validation schemas.
 *
 * 🔹 Endpoints Summary:
 * | Method | Route                  | Description                    |
 * |---------|------------------------|--------------------------------|
 * | POST    | `/comments`            | Create a new comment           |
 * | GET     | `/comments/outfit/:id` | Get all comments for an outfit |
 * | GET     | `/comments/:id`        | Retrieve a specific comment    |
 * | PUT     | `/comments/:id`        | Update an existing comment     |
 * | DELETE  | `/comments/:id`        | Delete a comment               |
 *
 * 🔹 Preconditions:
 * - Outfit and user referenced in the comment must exist.
 *
 * 🔹 Postconditions:
 * - Comment data is stored, updated, retrieved, or deleted as requested.
 */

import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  /**
   * ➕ POST /comments
   * Creates a new comment for a specific outfit.
   *
   * @param dto - Comment data including user ID, outfit ID, and comment text.
   * @returns Confirmation message and the created comment.
   *
   * 🔹 Precondition:
   * - Both `user_id` and `outfit_id` must reference valid existing records.
   *
   * 🔹 Postcondition:
   * - Comment is saved and linked to the outfit and user.
   */
  @Post()
  async create(@Body() dto: CreateCommentDto) {
    return this.service.create(dto);
  }

  /**
   * 📋 GET /comments/outfit/:outfit_id
   * Retrieves all comments associated with a specific outfit.
   *
   * @param outfit_id - The ID of the outfit to fetch comments for.
   * @returns Array of comment records related to the outfit.
   *
   * 🔹 Precondition:
   * - Outfit with the given ID must exist.
   *
   * 🔹 Postcondition:
   * - Returns all associated comments.
   */
  @Get('outfit/:outfit_id')
  async findAllByOutfit(@Param('outfit_id', ParseIntPipe) outfit_id: number) {
    return this.service.findAllByOutfit(outfit_id);
  }

  /**
   * 🔍 GET /comments/:id
   * Retrieves a specific comment by its unique ID.
   *
   * @param id - The comment’s primary key.
   * @returns Comment object if found.
   *
   * 🔹 Postcondition:
   * - Returns a single comment or throws a NotFoundException if not found.
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  /**
   * ✏️ PUT /comments/:id
   * Updates an existing comment’s text.
   *
   * @param id - ID of the comment to update.
   * @param dto - DTO containing updated comment text.
   * @returns Confirmation message and updated comment.
   *
   * 🔹 Precondition:
   * - Comment must exist in the database.
   *
   * 🔹 Postcondition:
   * - Comment text is updated in the database.
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.service.update(id, dto);
  }

  /**
   * ❌ DELETE /comments/:id
   * Deletes a comment permanently from the database.
   *
   * @param id - ID of the comment to delete.
   * @returns Success message upon deletion.
   *
   * 🔹 Precondition:
   * - The comment with the given ID must exist.
   *
   * 🔹 Postcondition:
   * - Comment is removed from the database.
   */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.service.delete(id);
    return { message: 'Comment deleted successfully.' };
  }
}
