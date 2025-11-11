/**
 * 🎽 Outfit Controller
 *
 * Handles all HTTP routes under `/outfits` for managing user-created outfits.
 * This controller acts as the bridge between the client-facing REST API
 * and the internal `OutfitService`, ensuring validation, structure, and
 * error handling for every request.
 *
 * 🔹 Responsibilities:
 * - Provide CRUD operations for outfits.
 * - Support a public "feed" endpoint with optional search and viewer filtering.
 * - Enforce input validation and error responses for missing data.
 *
 * 🔹 Endpoints Summary:
 * | Method | Path                   | Description                        |
 * |---------|------------------------|------------------------------------|
 * | GET     | /outfits               | Retrieve all outfits               |
 * | GET     | /outfits/feed          | Get public outfits (with search)   |
 * | GET     | /outfits/user/:user_id | Get outfits created by a user      |
 * | GET     | /outfits/:id           | Get outfit by its ID               |
 * | POST    | /outfits               | Create a new outfit                |
 * | PUT     | /outfits/:id           | Update an existing outfit          |
 * | DELETE  | /outfits/:id           | Delete an outfit                   |
 *
 * 🔹 Related Components:
 * - `OutfitService` → Business logic & database queries.
 * - `CreateOutfitDto`, `UpdateOutfitDto` → Validation schemas.
 *
 * 
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  BadRequestException,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { OutfitService } from './outfit.service';
import { CreateOutfitDto } from './dto/create-outfit.dto';
import { UpdateOutfitDto } from './dto/update-outfit.dto';

@Controller('outfits')
export class OutfitController {
  constructor(private readonly service: OutfitService) {}

  // -------------------- GET --------------------

  /**
   * Retrieves all outfits from the database (admin/internal use).
   *
   * @returns Promise resolving to an array of all outfits.
   */
  @Get()
  async findAll() {
    return this.service.getAll();
  }

  /**
   * Retrieves a public feed of outfits, optionally filtered by search term.
   * If `viewer_id` is provided, the service can tailor results based on the viewer.
   *
   * @param search Optional search keyword for outfit name or creator.
   * @param viewerIdParam Optional viewer ID for personalized context.
   * @returns Public outfits (paginated or filtered).
   */
  @Get('feed')
  async getFeed(
    @Query('search') search?: string,
    @Query('viewer_id') viewerIdParam?: string,
  ) {
    const trimmedSearch =
      typeof search === 'string' && search.trim().length > 0
        ? search.trim()
        : undefined;

    const viewerId =
      typeof viewerIdParam === 'string' && viewerIdParam.trim().length > 0
        ? Number(viewerIdParam)
        : undefined;

    const parsedViewerId =
      typeof viewerId === 'number' && !Number.isNaN(viewerId)
        ? viewerId
        : undefined;

    return this.service.getPublicFeed(trimmedSearch, parsedViewerId);
  }

  /**
   * Retrieves all outfits created by a specific user.
   *
   * @param user_id The numeric ID of the user.
   * @returns List of outfits belonging to the given user.
   */
  @Get('user/:user_id')
  async findByUser(@Param('user_id', ParseIntPipe) user_id: number) {
    return this.service.getByUser(user_id);
  }

  /**
   * Retrieves a single outfit by its ID.
   *
   * @param id The outfit’s unique numeric identifier.
   * @returns The corresponding outfit, if found.
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  // -------------------- POST --------------------

  /**
   * Creates a new outfit associated with a given user.
   *
   * @param dto CreateOutfitDto containing outfit details.
   * @throws BadRequestException if user_id is missing.
   * @returns The newly created outfit record.
   */
  @Post()
  async create(@Body() dto: CreateOutfitDto) {
    if (!dto.user_id) {
      throw new BadRequestException('user_id is required');
    }
    return this.service.create(dto);
  }

  // -------------------- PUT --------------------

  /**
   * Updates an existing outfit by its ID.
   *
   * @param id The outfit ID to update.
   * @param dto UpdateOutfitDto containing fields to modify.
   * @throws BadRequestException if no update data is provided.
   * @returns The updated outfit object.
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOutfitDto,
  ) {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('No data provided for update.');
    }
    return this.service.update(id, dto);
  }

  // -------------------- DELETE --------------------

  /**
   * Deletes an outfit by its unique ID.
   *
   * @param id The numeric outfit ID to remove.
   * @returns Confirmation message or deleted record metadata.
   */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
