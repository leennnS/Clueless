/**
 * 🔗 Controller: ClothingItemTagsController
 *
 * Manages API endpoints related to the relationship between clothing items and tags.
 * Each route interacts with the `ClothingItemTagsService` to create, retrieve,
 * and delete associations in the `clothing_item_tags` junction table.
 *
 * 🔹 Base Route: `/clothing-item-tags`
 * 🔹 Swagger Tag: `Clothing Item Tags`
 *
 * 🔹 Responsibilities:
 * - Retrieve all item–tag associations or those linked to a specific clothing item.
 * - Add a new tag to a clothing item.
 * - Remove an existing association between an item and a tag.
 *
 * 🔹 Related Files:
 * - `clothing-item-tags.service.ts` — core logic layer
 * - `clothing-item-tag.entity.ts` — database entity definition
 * - `create-clothing-item-tag.dto.ts` — input validation
 *
 * 🔹 Preconditions:
 * - The referenced `ClothingItem` and `Tag` must exist.
 *
 * 🔹 Postconditions:
 * - Associations are stored, retrieved, or deleted from the database accordingly.
 */

import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { ClothingItemTagsService } from './clothing-item-tags.service';
import { CreateClothingItemTagDto } from './dto/create-clothing-item-tag.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('Clothing Item Tags')
@Controller('clothing-item-tags')
export class ClothingItemTagsController {
  constructor(private readonly service: ClothingItemTagsService) {}

  /**
   * 📋 GET /clothing-item-tags
   * Retrieves all existing clothing-item–tag associations.
   *
   * @returns All records from the `clothing_item_tags` table.
   *
   * 🔹 Postcondition:
   * - Returns a list of all associations between clothing items and tags.
   */
  @Get()
  getAll() {
    return this.service.getAll();
  }

  /**
   * 🎯 GET /clothing-item-tags/item/:item_id
   * Retrieves all tag associations for a specific clothing item.
   *
   * @param item_id - ID of the clothing item.
   * @returns All tags linked to the given item.
   *
   * 🔹 Precondition:
   * - The specified item must exist.
   *
   * 🔹 Postcondition:
   * - Returns an array of tag associations for the item.
   */
  @Get('item/:item_id')
  getByItem(@Param('item_id', ParseIntPipe) item_id: number) {
    return this.service.getByItem(item_id);
  }

  /**
   * ➕ POST /clothing-item-tags
   * Creates a new link between a clothing item and a tag.
   *
   * @param dto - Data Transfer Object containing `item_id` and `tag_id`.
   * @returns Confirmation message and the created association.
   *
   * 🔹 Precondition:
   * - Both `item_id` and `tag_id` must reference existing records.
   *
   * 🔹 Postcondition:
   * - A new record is added to `clothing_item_tags`.
   */
  @Post()
  @ApiBody({ type: CreateClothingItemTagDto })
  addTag(@Body() dto: CreateClothingItemTagDto) {
    if (!dto.item_id || !dto.tag_id)
      throw new BadRequestException('Missing item_id or tag_id.');
    return this.service.addTagToItem(dto);
  }

  /**
   * ❌ DELETE /clothing-item-tags/:id
   * Deletes an existing clothing-item–tag association by its unique ID.
   *
   * @param id - ID of the association record to remove.
   * @returns Confirmation message upon successful deletion.
   *
   * 🔹 Precondition:
   * - The specified record must exist in the database.
   *
   * 🔹 Postcondition:
   * - The association is permanently deleted.
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
