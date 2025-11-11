/**
 * Controller: OutfitItemController
 *
 * Manages HTTP endpoints for handling outfit–item relationships.
 * Provides CRUD operations for adding, updating, retrieving,
 * and removing clothing items within a specific outfit layout.
 *
 * Acts as the interface between incoming API requests and the
 * OutfitItemService business logic layer.
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
import { OutfitItemService } from './outfit-item.service';
import { CreateOutfitItemDto } from './dto/create-outfit-item.dto';
import { UpdateOutfitItemDto } from './dto/update-outfit-item.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('Outfit Items')
@Controller('outfit-items')
export class OutfitItemController {
  constructor(private readonly service: OutfitItemService) {}

  // ---------------------------------------------------------------------------
  // GET ALL
  // ---------------------------------------------------------------------------

  /**
   * Retrieves all outfit items from the database.
   *
   * Typically used for administrative review or debugging.
   *
   * @returns A list of all outfit–item mappings with related details.
   */
  @Get()
  async findAll() {
    return this.service.getAll();
  }

  // ---------------------------------------------------------------------------
  // GET BY ID
  // ---------------------------------------------------------------------------

  /**
   * Retrieves a single outfit item by its unique identifier.
   *
   * @param id The numeric ID of the outfit item.
   * @returns The outfit item record if found.
   *
   * Preconditions:
   * - `id` must correspond to an existing outfit–item record.
   *
   * Postconditions:
   * - Throws `NotFoundException` if no record matches the given ID.
   */
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  // ---------------------------------------------------------------------------
  // GET BY OUTFIT
  // ---------------------------------------------------------------------------

  /**
   * Retrieves all clothing items that belong to a specific outfit.
   *
   * @param outfit_id The unique identifier of the outfit.
   * @returns List of items linked to that outfit.
   *
   * Preconditions:
   * - `outfit_id` must exist in the database.
   *
   * Postconditions:
   * - Returns all items attached to that outfit or an empty array.
   */
  @Get('outfit/:outfit_id')
  async findByOutfit(@Param('outfit_id', ParseIntPipe) outfit_id: number) {
    return this.service.getByOutfit(outfit_id);
  }

  // ---------------------------------------------------------------------------
  // CREATE
  // ---------------------------------------------------------------------------

  /**
   * Adds a new clothing item to a specific outfit layout.
   *
   * @param dto Data Transfer Object containing outfit ID, item ID,
   *            and optional position/transform data.
   * @returns A confirmation message and the created mapping.
   *
   * Preconditions:
   * - Both `outfit_id` and `item_id` must be valid.
   *
   * Postconditions:
   * - The outfit item is persisted in the database and linked properly.
   */
  @Post()
  @ApiBody({ type: CreateOutfitItemDto })
  async create(@Body() dto: CreateOutfitItemDto) {
    if (!dto.outfit_id || !dto.item_id) {
      throw new BadRequestException('Missing outfit_id or item_id.');
    }
    return this.service.create(dto);
  }

  // ---------------------------------------------------------------------------
  // UPDATE
  // ---------------------------------------------------------------------------

  /**
   * Updates the position or properties of an existing outfit item.
   *
   * @param id The numeric ID of the outfit item to update.
   * @param dto Data Transfer Object with updated position, z-index,
   *            or transformation values.
   * @returns The updated outfit item record.
   *
   * Preconditions:
   * - The outfit item with the given ID must exist.
   *
   * Postconditions:
   * - The outfit item record is updated and saved in the database.
   */
  @Put(':id')
  @ApiBody({ type: UpdateOutfitItemDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOutfitItemDto,
  ) {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('No data provided for update.');
    }
    return this.service.update(id, dto);
  }

  // ---------------------------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------------------------

  /**
   * Deletes an outfit–item link from the database.
   *
   * @param id The numeric ID of the outfit item to delete.
   * @returns Confirmation message upon successful deletion.
   *
   * Preconditions:
   * - The outfit item ID must exist.
   *
   * Postconditions:
   * - The record is permanently removed from the database.
   */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
