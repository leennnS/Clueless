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
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutfitItem } from './outfit-item.entity';
import { CreateOutfitItemInput } from './dto/create-outfit-item.dto';
import { UpdateOutfitItemInput } from './dto/update-outfit-item.dto';
import { OutfitItemPayload } from './outfit-item.types';
import { MessagePayload } from '../user/user.types';

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
  async getAll(): Promise<OutfitItemPayload[]> {
    const items = await this.repo.find({ relations: ['outfit', 'item'] });
    return items.map((i) => this.mapPayload(i));
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
  async getById(id: number): Promise<OutfitItemPayload> {
    const record = await this.repo.findOne({
      where: { outfit_item_id: id },
      relations: ['outfit', 'item'],
    });
    if (!record) throw new NotFoundException('Outfit item not found.');
    return this.mapPayload(record);
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
  async getByOutfit(outfit_id: number): Promise<OutfitItemPayload[]> {
    const items = await this.repo.find({
      where: { outfit: { outfit_id } },
      relations: ['outfit', 'item'],
      order: { z_index: 'ASC' },
    });
    if (!items.length) {
      return [];
    }
    return items.map((i) => this.mapPayload(i));
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
  async create(data: CreateOutfitItemInput): Promise<{ message: string; outfit_item: OutfitItemPayload }> {
    const { outfit_id, item_id } = data;
    if (!outfit_id || !item_id) {
      throw new BadRequestException('Missing outfit_id or item_id.');
    }

    const normalizedTransform = this.normalizeTransform(data.transform);
    const outfitItem = this.repo.create({
      ...data,
      transform: normalizedTransform,
      outfit: { outfit_id } as any,
      item: { item_id } as any,
    });

    const saved = await this.repo.save(outfitItem);
    const hydrated = await this.repo.findOne({
      where: { outfit_item_id: saved.outfit_item_id },
      relations: ['outfit', 'item'],
    });
    return {
      message: 'Outfit item added successfully',
      outfit_item: this.mapPayload(hydrated ?? saved, { outfit_id, item_id }),
    };
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
  async update(
    id: number,
    updates: UpdateOutfitItemInput,
  ): Promise<{ message: string; outfit_item: OutfitItemPayload }> {
    const outfitItem = await this.repo.findOne({
      where: { outfit_item_id: id },
    });
    if (!outfitItem) throw new NotFoundException('Outfit item not found.');

    const normalizedTransform = this.normalizeTransform(updates.transform);
    Object.assign(outfitItem, {
      ...updates,
      ...(normalizedTransform !== undefined ? { transform: normalizedTransform } : {}),
    });
    const updated = await this.repo.save(outfitItem);
    const hydrated = await this.repo.findOne({
      where: { outfit_item_id: updated.outfit_item_id },
      relations: ['outfit', 'item'],
    });

    const resolvedOutfitId =
      outfitItem.outfit?.outfit_id ?? (outfitItem as any).outfit_id ?? updates.outfit_id;
    const resolvedItemId =
      outfitItem.item?.item_id ?? (outfitItem as any).item_id ?? updates.item_id;
    return {
      message: 'Outfit item updated successfully',
      outfit_item: this.mapPayload(hydrated ?? updated, {
        outfit_id: resolvedOutfitId ?? undefined,
        item_id: resolvedItemId ?? undefined,
      }),
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
  async delete(id: number): Promise<MessagePayload> {
    const result = await this.repo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Outfit item not found.');
    return { message: 'Outfit item deleted successfully' };
  }

  private mapPayload(
    outfitItem: OutfitItem,
    fallback?: { outfit_id?: number; item_id?: number },
  ): OutfitItemPayload {
    const fallbackOutfitId = fallback?.outfit_id;
    const fallbackItemId = fallback?.item_id;
    return {
      outfit_item_id: outfitItem.outfit_item_id,
      outfit_id: outfitItem.outfit?.outfit_id ?? fallbackOutfitId ?? (outfitItem as any).outfit_id,
      item_id: outfitItem.item?.item_id ?? fallbackItemId ?? (outfitItem as any).item_id,
      x_position: outfitItem.x_position,
      y_position: outfitItem.y_position,
      z_index: outfitItem.z_index,
      transform: outfitItem.transform ? JSON.stringify(outfitItem.transform) : null,
      outfit: outfitItem.outfit,
      item: outfitItem.item,
    };
  }

  private normalizeTransform(value?: string | Record<string, any> | null): Record<string, any> | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return typeof parsed === 'object' && parsed !== null ? parsed : undefined;
      } catch {
        return undefined;
      }
    }
    if (typeof value === 'object') {
      return value;
    }
    return undefined;
  }
}
