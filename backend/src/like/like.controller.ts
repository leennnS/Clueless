/**
 * ❤️ Controller: LikesController
 *
 * Manages all HTTP endpoints related to outfit likes.
 * Handles creating, toggling, deleting, and fetching likes for both users and outfit creators.
 *
 * 🔹 Base Route: `/likes`
 * 🔹 Swagger Tag: `Likes`
 *
 * 🔹 Purpose:
 * - Allow users to like or unlike outfits.
 * - Fetch all likes, likes by user, or likes on a creator’s outfits.
 * - Handle like toggling in a single unified endpoint.
 *
 * 🔹 Related Components:
 * - `like.service.ts` → Business logic layer.
 * - `like.entity.ts` → Database schema for storing likes.
 * - `create-like.dto.ts` → Validation schema for like creation.
 *
 * 🔹 Endpoints Summary:
 * | Method | Route                   | Description                                 |
 * |---------|-------------------------|---------------------------------------------|
 * | GET     | `/likes`                | Retrieve all likes                          |
 * | GET     | `/likes/user/:user_id`  | Retrieve likes by user                      |
 * | GET     | `/likes/creator/:id`    | Retrieve all likes on a creator’s outfits   |
 * | GET     | `/likes/:id`            | Retrieve a single like by ID                |
 * | POST    | `/likes`                | Create a new like record                    |
 * | POST    | `/likes/toggle`         | Toggle like/unlike for a user and outfit    |
 * | DELETE  | `/likes/:id`            | Delete a like by its unique ID              |
 *
 * 🔹 Preconditions:
 * - The specified user and outfit must exist before liking.
 *
 * 🔹 Postconditions:
 * - A like record is created, toggled, or deleted as requested.
 */

import {
  Body,
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LikesService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';

@ApiTags('Likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly service: LikesService) {}

  /**
   * 📋 GET /likes
   * Retrieves all likes in the system.
   *
   * @returns Array of all like records with user and outfit relations.
   */
  @Get()
  async findAll() {
    return this.service.getAll();
  }

  /**
   * 🧍 GET /likes/user/:user_id
   * Retrieves all outfits liked by a specific user.
   *
   * @param user_id - The ID of the user.
   * @returns Array of outfits liked by the user.
   *
   * 🔹 Precondition:
   * - User must exist.
   *
   * 🔹 Postcondition:
   * - Returns all likes associated with the user.
   */
  @Get('user/:user_id')
  async findByUser(@Param('user_id', ParseIntPipe) user_id: number) {
    return this.service.getByUser(user_id);
  }

  /**
   * 👗 GET /likes/creator/:user_id
   * Retrieves all likes received by a creator’s outfits.
   *
   * @param user_id - The ID of the creator (outfit owner).
   * @returns Array of likes on the creator’s outfits.
   *
   * 🔹 Precondition:
   * - The creator must exist and have published outfits.
   *
   * 🔹 Postcondition:
   * - Returns all likes received by that creator.
   */
  @Get('creator/:user_id')
  async findCreatorInbox(@Param('user_id', ParseIntPipe) user_id: number) {
    return this.service.getForCreator(user_id);
  }

  /**
   * 🔍 GET /likes/:id
   * Retrieves a single like by its unique identifier.
   *
   * @param id - ID of the like record.
   * @returns The like record if found.
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  /**
   * ❤️ POST /likes
   * Creates a new like entry linking a user and an outfit.
   *
   * @param dto - Contains `user_id` and `outfit_id`.
   * @returns The newly created like record.
   *
   * 🔹 Precondition:
   * - Both user and outfit must exist.
   *
   * 🔹 Postcondition:
   * - A new like record is created.
   */
  @Post()
  @ApiBody({ type: CreateLikeDto })
  async create(@Body() dto: CreateLikeDto) {
    const { user_id, outfit_id } = dto;
    if (!user_id || !outfit_id) {
      throw new BadRequestException('user_id and outfit_id are required');
    }

    return this.service.create(user_id, outfit_id);
  }

  /**
   * 🔁 POST /likes/toggle
   * Toggles a like for a user and outfit — if the like exists, removes it;
   * if it does not, creates it.
   *
   * @param dto - Contains `user_id` and `outfit_id`.
   * @returns Object indicating the action performed (liked/unliked).
   *
   * 🔹 Precondition:
   * - Both user and outfit must exist.
   *
   * 🔹 Postcondition:
   * - A like is either added or removed.
   */
  @Post('toggle')
  async toggle(@Body() dto: CreateLikeDto) {
    const { user_id, outfit_id } = dto;
    if (!user_id || !outfit_id) {
      throw new BadRequestException('user_id and outfit_id are required');
    }

    return this.service.toggle(user_id, outfit_id);
  }

  /**
   * ❌ DELETE /likes/:id
   * Deletes a like by its unique ID.
   *
   * @param id - ID of the like record.
   * @returns Confirmation message upon deletion.
   *
   * 🔹 Precondition:
   * - The like record must exist.
   *
   * 🔹 Postcondition:
   * - The record is permanently removed.
   */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
