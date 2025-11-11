/**
 * Service: OutfitItemService
 *
 * Handles all business logic for managing outfit–item relationships.
 * Provides CRUD operations for linking clothing items to specific outfits,
 * as well as updating their layout and transformation data.
 *
 * This service interacts directly with the database layer through
 * TypeORM repositories and ensures referential integrity between
 * outfits and clothing items.
 */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutfitItem } from './outfit-item.entity';
import { CreateOutfitItemDto } from './dto/create-outfit-item.dto';
import { UpdateOutfitItemDto } from './dto/update-outfit-item.dto';

@Injectable()
export class OutfitItemService {
  constructor(
    @InjectRepository(OutfitItem)
    private readonly repo: Repository<OutfitItem>,
  ) {}

  // ---------------------------------------------------------------------------
  // GET ALL
  // ---------------------------------------------------------------------------

  /**
   * Retrieves all outfit–item mappings from the database.
   *
   * @returns A list of all existing OutfitItem records,
   *          including their linked outfit and clothing item entities.
   */
  async getAll() {
    return this.repo.find({ relations: ['outfit', 'item'] });
  }

  // ---------------------------------------------------------------------------
  // GET BY ID
  // ---------------------------------------------------------------------------

  /**
   * Retrieves a specific outfit item by its unique identifier.
   *
   * @param id - The numeric ID of the outfit item.
   * @returns The OutfitItem entity with associated outfit and item details.
   *
   * Preconditions:
   * - `id` must correspond to an existing record in the `outfit_items` table.
   *
   * Postconditions:
   * - Throws `NotFoundException` if the ID does not exist.
   */
  async getById(id: number) {
    const record = await this.repo.findOne({
      where: { outfit_item_id: id },
      relations: ['outfit', 'item'],
    });
    if (!record) throw new NotFoundException('Outfit item not found.');
    return record;
  }

  // ---------------------------------------------------------------------------
  // GET BY OUTFIT
  // ---------------------------------------------------------------------------

  /**
   * Retrieves all clothing items belonging to a specific outfit.
   *
   * @param outfit_id - The numeric ID of the parent outfit.
   * @returns An array of OutfitItem entities associated with that outfit.
   *
   * Preconditions:
   * - The `outfit_id` must exist in the database.
   *
   * Postconditions:
   * - Throws `NotFoundException` if no items are linked to the outfit.
   */
  async getByOutfit(outfit_id: number) {
    const items = await this.repo.find({
      where: { outfit: { outfit_id } },
      relations: ['outfit', 'item'],
    });
    if (!items.length)
      throw new NotFoundException('No clothing items found for this outfit.');
    return items;
  }

  // ---------------------------------------------------------------------------
  // CREATE
  // ---------------------------------------------------------------------------

  /**
   * Creates a new outfit–item association.
   *
   * @param data - DTO containing outfit ID, item ID, and optional
   *               layout metadata such as position or transformation.
   * @returns Confirmation message and the persisted OutfitItem entity.
   *
   * Preconditions:
   * - Both `outfit_id` and `item_id` must be provided.
   *
   * Postconditions:
   * - A new record is stored linking the clothing item to the outfit.
   */
  async create(data: CreateOutfitItemDto) {
    const { outfit_id, item_id } = data;
    if (!outfit_id || !item_id) {
      throw new BadRequestException('Missing outfit_id or item_id.');
    }

    const outfitItem = this.repo.create({
      ...data,
      outfit: { outfit_id } as any,
      item: { item_id } as any,
    });

    const saved = await this.repo.save(outfitItem);
    return { message: 'Outfit item added successfully', outfit_item: saved };
  }

  // ---------------------------------------------------------------------------
  // UPDATE
  // ---------------------------------------------------------------------------

  /**
   * Updates layout or transformation data of an existing outfit item.
   *
   * @param id - The unique ID of the outfit item.
   * @param updates - DTO containing updated x/y positions,
   *                  z-index, or transformation metadata.
   * @returns Confirmation message and the updated OutfitItem entity.
   *
   * Preconditions:
   * - The specified outfit item must exist in the database.
   *
   * Postconditions:
   * - The record is updated with new layout parameters.
   */
  async update(id: number, updates: UpdateOutfitItemDto) {
    const outfitItem = await this.repo.findOne({
      where: { outfit_item_id: id },
    });
    if (!outfitItem) throw new NotFoundException('Outfit item not found.');

    Object.assign(outfitItem, updates);
    const updated = await this.repo.save(outfitItem);

    return {
      message: 'Outfit item updated successfully',
      outfit_item: updated,
    };
  }

  // ---------------------------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------------------------

  /**
   * Deletes an outfit–item record from the database.
   *
   * @param id - The numeric ID of the outfit item to remove.
   * @returns Confirmation message once deletion is successful.
   *
   * Preconditions:
   * - The specified outfit item must exist.
   *
   * Postconditions:
   * - The record is permanently removed from storage.
   */
  async delete(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Outfit item not found.');
    return { message: 'Outfit item deleted successfully' };
  }
}
