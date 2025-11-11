/**
 * 🎯 Controller: ClothingItemController
 *
 * Handles all HTTP requests related to clothing items within the wardrobe system.
 * This controller acts as the main entry point between the frontend and backend
 * for CRUD operations on clothing items.
 *
 * 🔹 Base Route: `/clothing-items`
 * 🔹 Swagger Tag: `Clothing Items`
 *
 * 🔹 Responsibilities:
 * - Manage item creation, retrieval, updates, and deletion.
 * - Delegate business logic to the `ClothingItemService`.
 * - Validate request data using DTOs (`CreateClothingItemDto`, `UpdateClothingItemDto`).
 * - Provide type-safe API responses for the frontend.
 *
 * 🔹 Related Files:
 * - `clothing-item.service.ts` — contains business logic
 * - `create-clothing-item.dto.ts` — defines input validation for item creation
 * - `update-clothing-item.dto.ts` — defines input validation for updates
 *
 * 🔹 Example Routes:
 * - `GET /clothing-items`
 * - `GET /clothing-items/:id`
 * - `GET /clothing-items/user/:user_id`
 * - `POST /clothing-items`
 * - `PUT /clothing-items/:id`
 * - `DELETE /clothing-items/:id`
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
} from '@nestjs/common';
import {
  ClothingItemResponse,
  ClothingItemService,
} from './clothing-item.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UpdateClothingItemDto } from './dto/update-clothing-item.dto';
import { CreateClothingItemDto } from './dto/create-clothing-item.dto';

@ApiTags('Clothing Items')
@Controller('clothing-items')
export class ClothingItemController {
  constructor(private readonly service: ClothingItemService) {}

  /**
   * 📦 GET /clothing-items
   * Retrieves all clothing items available in the database.
   *
   * @returns {Promise<ClothingItemResponse[]>}
   * A list of all clothing items.
   *
   * 🔹 Precondition:
   * - Database connection must be active.
   *
   * 🔹 Postcondition:
   * - Returns an array of clothing item objects with their associated user and tags.
   */
  @Get()
  async findAll(): Promise<ClothingItemResponse[]> {
    return this.service.getAll();
  }

  /**
   * 🔍 GET /clothing-items/:id
   * Retrieves a single clothing item by its unique ID.
   *
   * @param id - The unique identifier of the clothing item.
   * @returns {Promise<ClothingItemResponse>}
   * The matching clothing item, or an error if not found.
   *
   * 🔹 Precondition:
   * - The ID must be a valid integer.
   *
   * 🔹 Postcondition:
   * - Returns item details or throws `NotFoundException`.
   */
  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ClothingItemResponse> {
    return this.service.getById(id);
  }

  /**
   * 👕 GET /clothing-items/user/:user_id
   * Retrieves all clothing items belonging to a specific user.
   *
   * @param user_id - The ID of the user whose wardrobe items should be retrieved.
   * @returns {Promise<ClothingItemResponse[]>}
   * A list of clothing items owned by the given user.
   *
   * 🔹 Precondition:
   * - The user must exist in the database.
   *
   * 🔹 Postcondition:
   * - Returns all clothing items linked to that user.
   */
  @Get('user/:user_id')
  async findByUser(
    @Param('user_id', ParseIntPipe) user_id: number,
  ): Promise<ClothingItemResponse[]> {
    return this.service.getByUser(user_id);
  }

  /**
   * ➕ POST /clothing-items
   * Creates a new clothing item for the given user.
   *
   * @param dto - The clothing item data (name, category, color, image, user_id, tags).
   * @returns {Promise<{ message: string; item: ClothingItemResponse }>}
   * The newly created item and a success message.
   *
   * 🔹 Precondition:
   * - The request body must contain valid `CreateClothingItemDto` fields.
   * - The `user_id` must correspond to an existing user.
   *
   * 🔹 Postcondition:
   * - A new record is added to the `clothing_items` table.
   */
  @Post()
  @ApiBody({ type: CreateClothingItemDto })
  async create(
    @Body() dto: CreateClothingItemDto,
  ): Promise<{ message: string; item: ClothingItemResponse }> {
    return this.service.create(dto);
  }

  /**
   * ✏️ PUT /clothing-items/:id
   * Updates an existing clothing item.
   *
   * @param id - The unique ID of the item to update.
   * @param dto - Partial data for fields to update.
   * @returns {Promise<{ message: string; item: ClothingItemResponse }>}
   * The updated clothing item and a success message.
   *
   * 🔹 Precondition:
   * - The item must exist in the database.
   * - The request body must contain valid `UpdateClothingItemDto` fields.
   *
   * 🔹 Postcondition:
   * - The record is updated, and the updated object is returned.
   */
  @Put(':id')
  @ApiBody({ type: UpdateClothingItemDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClothingItemDto,
  ): Promise<{ message: string; item: ClothingItemResponse }> {
    return this.service.update(id, dto);
  }

  /**
   * ❌ DELETE /clothing-items/:id
   * Deletes a clothing item by its unique ID.
   *
   * @param id - The ID of the item to delete.
   * @returns {Promise<{ message: string }>}
   * A confirmation message once the item is deleted.
   *
   * 🔹 Precondition:
   * - The item must exist in the database.
   *
   * 🔹 Postcondition:
   * - The record is removed from the database.
   */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
