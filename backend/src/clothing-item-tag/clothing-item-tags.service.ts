/**
 * 🧩 Service: ClothingItemTagsService
 *
 * Handles the business logic and database interactions for the
 * `clothing_item_tags` table — the junction entity that connects
 * `ClothingItem` and `Tag` in a many-to-many relationship.
 *
 * 🔹 Purpose:
 * - Manages creation, retrieval, and deletion of item–tag mappings.
 * - Ensures no duplicate associations are created.
 * - Provides error handling for invalid or missing relationships.
 *
 * 🔹 Related Components:
 * - `clothing-item-tags.controller.ts` → REST API layer
 * - `clothing-item-tag.entity.ts` → Database entity
 * - `create-clothing-item-tag.dto.ts` → Input validation
 *
 * 🔹 Database Relations:
 * - ManyToOne → `ClothingItem`
 * - ManyToOne → `Tag`
 *
 * 🔹 Preconditions:
 * - Both the `ClothingItem` and `Tag` must exist before linking.
 *
 * 🔹 Postconditions:
 * - A valid mapping record is created, retrieved, or deleted.
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClothingItemTag } from './clothing-item-tag.entity';
import { CreateClothingItemTagInput } from './dto/create-clothing-item-tag.dto';
import { MessagePayload } from '../user/user.types';

@Injectable()
export class ClothingItemTagsService {
  constructor(
    @InjectRepository(ClothingItemTag)
    private readonly repo: Repository<ClothingItemTag>,
  ) {}

  /**
   * 📋 Retrieves all clothing-item–tag associations.
   *
   * @returns Array of mappings including related `clothing_item` and `tag` entities.
   *
   * 🔹 Postcondition:
   * - Returns a list of all associations stored in `clothing_item_tags`.
   */
  async findAll(): Promise<ClothingItemTag[]> {
    return this.repo.find({ relations: ['clothing_item', 'tag'] });
  }

  async findOne(id: number): Promise<ClothingItemTag> {
    const mapping = await this.repo.findOne({ where: { id }, relations: ['clothing_item', 'tag'] });
    if (!mapping) {
      throw new NotFoundException('Clothing item tag mapping not found.');
    }
    return mapping;
  }

  /**
   * 🎯 Retrieves all tags associated with a specific clothing item.
   *
   * @param item_id - ID of the clothing item.
   * @returns Array of tag associations related to the given item.
   *
   * 🔹 Precondition:
   * - The clothing item with the given `item_id` must exist.
   *
   * 🔹 Postcondition:
   * - Returns all linked tags or throws a NotFoundException if none are found.
   */
  async getByItem(item_id: number): Promise<ClothingItemTag[]> {
    const mappings = await this.repo.find({
      where: { clothing_item: { item_id } },
      relations: ['clothing_item', 'tag'],
    });
    if (!mappings.length)
      throw new NotFoundException('No tags found for this clothing item.');
    return mappings;
  }

  /**
   * ➕ Creates a new link between a clothing item and a tag.
   *
   * @param dto - Data Transfer Object containing `item_id` and `tag_id`.
   * @returns Success message and the created mapping entity.
   *
   * 🔹 Precondition:
   * - `item_id` and `tag_id` must both be valid and not already linked.
   *
   * 🔹 Postcondition:
   * - A new record is inserted into `clothing_item_tags`.
   * - If the mapping already exists, a BadRequestException is thrown.
   */
  async addTagToItem(dto: CreateClothingItemTagInput): Promise<{
    message: string;
    mapping: ClothingItemTag;
  }> {
    const { item_id, tag_id } = dto;

    if (!item_id || !tag_id)
      throw new BadRequestException('item_id and tag_id are required.');

    const existing = await this.repo.findOne({
      where: { clothing_item: { item_id }, tag: { tag_id } },
    });
    if (existing)
      throw new BadRequestException(
        'This tag is already assigned to the item.',
      );

    const entity = this.repo.create({
      clothing_item: { item_id } as any,
      tag: { tag_id } as any,
    });

    const saved = await this.repo.save(entity);
    return {
      message: 'Tag linked to clothing item successfully',
      mapping: saved,
    };
  }

  async create(dto: CreateClothingItemTagInput): Promise<ClothingItemTag> {
    const result = await this.addTagToItem(dto);
    return this.findOne(result.mapping.id) as Promise<ClothingItemTag>;
  }

  /**
   * ❌ Deletes a specific clothing-item–tag mapping.
   *
   * @param id - ID of the mapping record.
   * @returns Confirmation message upon successful deletion.
   *
   * 🔹 Precondition:
   * - A record with the given `id` must exist.
   *
   * 🔹 Postcondition:
   * - The record is permanently deleted.
   * - Throws NotFoundException if no matching record is found.
   */
  async remove(id: number): Promise<MessagePayload> {
    const result = await this.repo.delete(id);
    if (!result.affected)
      throw new NotFoundException('Mapping not found or already removed');
    return { message: 'Tag removed from item successfully' };
  }
}
