/**
 * 🧠 Service: ClothingItemService
 *
 * Handles all business logic for managing clothing items within the wardrobe module.
 * This service communicates with the database using TypeORM repositories and provides
 * data transformation for controller responses.
 *
 * 🔹 Responsibilities:
 * - Perform CRUD operations for clothing items.
 * - Handle image uploads (base64 to file storage).
 * - Validate and associate tags with clothing items.
 * - Manage relationships with `User`, `Tag`, and `ClothingItemTag` entities.
 * - Format and return responses for the API layer.
 *
 * 🔹 Related Files:
 * - `clothing-item.controller.ts`
 * - `clothing-item.entity.ts`
 * - `create-clothing-item.dto.ts`
 * - `update-clothing-item.dto.ts`
 *
 * 🔹 Preconditions:
 * - TypeORM connection must be initialized.
 * - Related entities (`User`, `Tag`, `ClothingItemTag`) must exist in the database.
 *
 * 🔹 Postconditions:
 * - Database is updated with valid CRUD operations.
 * - Uploaded images are stored under `/public/images/uploads/`.
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { promises as fs } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { ClothingItem } from './clothing-item.entity';
import { ClothingItemTag } from '../clothing-item-tag/clothing-item-tag.entity';
import { Tag } from '../tag/tag.entity';
import { CreateClothingItemDto } from './dto/create-clothing-item.dto';
import { UpdateClothingItemDto } from './dto/update-clothing-item.dto';
import { User } from '../user/user.entity';

export type ClothingItemWithTags = ClothingItem & {
  clothing_item_tags?: ClothingItemTag[];
  user?: User;
};

export interface TagSummary {
  tag_id: number;
  name: string;
}

export interface ClothingItemResponse {
  item_id: number;
  name: string;
  category: string;
  color?: string | null;
  image_url?: string | null;
  uploaded_at: Date;
  updated_at: Date;
  user?: {
    user_id: number;
    username?: string | null;
    email?: string | null;
  };
  tags: TagSummary[];
}

const UPLOAD_DIR = join(__dirname, '..', '..', 'public', 'images', 'uploads');
const PRESET_TAG_NAMES = [
  'summer',
  'winter',
  'spring',
  'autumn',
  'rainy',
  'cold',
  'warm',
  'layered',
  'lightweight',
] as const;
const PRESET_TAG_NAME_SET = new Set(
  PRESET_TAG_NAMES.map((name) => name.toLowerCase()),
);

@Injectable()
export class ClothingItemService {
  constructor(
    @InjectRepository(ClothingItem)
    private readonly repo: Repository<ClothingItem>,
    @InjectRepository(ClothingItemTag)
    private readonly clothingItemTagRepo: Repository<ClothingItemTag>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  /**
   * Ensures the upload directory exists for storing item images.
   * Creates the directory recursively if it does not exist.
   */
  private async ensureUploadDir() {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }

  /**
   * Converts a base64 image string into a physical image file on the server.
   *
   * @param dataUri - base64 encoded image data (must start with `data:image`)
   * @returns The relative path of the stored image file.
   *
   * 🔹 Preconditions:
   * - Must receive a valid base64 image string.
   *
   * 🔹 Postconditions:
   * - A new image file is written to the uploads directory.
   */
  private async storeBase64Image(dataUri: string): Promise<string> {
    if (!dataUri.startsWith('data:image')) {
      throw new BadRequestException(
        'Invalid image format. Please upload a valid image.',
      );
    }

    const [metadata, base64Data] = dataUri.split(',');
    if (!base64Data) {
      throw new BadRequestException('Invalid image data.');
    }

    const extensionMatch = metadata.match(/data:image\/(\w+);base64/);
    const extension = extensionMatch?.[1] ?? 'png';
    const filename = `${randomUUID()}.${extension}`;

    await this.ensureUploadDir();
    const filePath = join(UPLOAD_DIR, filename);
    await fs.writeFile(filePath, Buffer.from(base64Data, 'base64'));

    return `/images/uploads/${filename}`;
  }

  /**
   * Maps a ClothingItem entity and its relationships to a response DTO.
   * Converts tag entities into a simplified `TagSummary` array.
   */
  private mapWithTags(item: ClothingItemWithTags): ClothingItemResponse {
    const user = item.user;
    const tags: TagSummary[] =
      item.clothing_item_tags
        ?.map((link) => link?.tag)
        .filter((tag): tag is Tag => Boolean(tag))
        .map((tag) => ({
          tag_id: tag.tag_id,
          name: tag.name,
        })) ?? [];

    return {
      item_id: item.item_id,
      name: item.name,
      category: item.category,
      color: item.color,
      image_url: item.image_url,
      uploaded_at: item.uploaded_at,
      updated_at: item.updated_at,
      user: user
        ? {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
          }
        : undefined,
      tags,
    };
  }

  // ---------------------------------------------------------------------
  // 🔹 READ OPERATIONS
  // ---------------------------------------------------------------------

  /**
   * Retrieves all clothing items with user and tag relations.
   * @returns Array of clothing items.
   */
  async getAll(): Promise<ClothingItemResponse[]> {
    const items = await this.repo.find({
      relations: ['user', 'clothing_item_tags', 'clothing_item_tags.tag'],
    });
    return items.map((item) => this.mapWithTags(item));
  }

  /**
   * Retrieves a clothing item by its unique ID.
   * @throws NotFoundException if no item is found.
   */
  async getById(id: number): Promise<ClothingItemResponse> {
    const item = await this.repo.findOne({
      where: { item_id: id },
      relations: ['user', 'clothing_item_tags', 'clothing_item_tags.tag'],
    });
    if (!item) throw new NotFoundException('Clothing item not found.');
    return this.mapWithTags(item);
  }

  /**
   * Retrieves all clothing items belonging to a specific user.
   * @throws NotFoundException if the user has no items.
   */
  async getByUser(user_id: number): Promise<ClothingItemResponse[]> {
    const items = await this.repo.find({
      where: { user: { user_id } },
      relations: ['user', 'clothing_item_tags', 'clothing_item_tags.tag'],
    });
    if (!items.length)
      throw new NotFoundException('No clothing items found for this user.');
    return items.map((item) => this.mapWithTags(item));
  }

  // ---------------------------------------------------------------------
  // 🔹 CREATE OPERATION
  // ---------------------------------------------------------------------

  /**
   * Creates a new clothing item with optional tags and image.
   *
   * @param dto - Data Transfer Object containing item details.
   * @returns The created clothing item response and success message.
   *
   * 🔹 Preconditions:
   * - DTO must include `name`, `category`, and `user_id`.
   * - Tags (IDs or names) must exist or be valid presets.
   *
   * 🔹 Postconditions:
   * - A new record is inserted into `clothing_items`.
   * - Linked tags are created or associated.
   * - Uploaded image is saved and referenced by URL.
   */
  async create(
    dto: CreateClothingItemDto,
  ): Promise<{ message: string; item: ClothingItemResponse }> {
    const { name, category, user_id, image_url, color, tag_ids, tag_names } =
      dto;

    if (!name || !category || !user_id) {
      throw new BadRequestException('Missing required fields.');
    }

    // Normalize and validate tag names
    const normalizedTagNames =
      Array.isArray(tag_names) && tag_names.length
        ? Array.from(
            new Set(
              tag_names
                .map((tag) =>
                  typeof tag === 'string' ? tag.trim().toLowerCase() : '',
                )
                .filter((tag) => tag.length > 0),
            ),
          )
        : [];

    const tagLabelMap = new Map(
      (tag_names ?? [])
        .map((tag) =>
          typeof tag === 'string'
            ? [tag.trim().toLowerCase(), tag.trim()]
            : null,
        )
        .filter(
          (entry): entry is [string, string] =>
            Array.isArray(entry) && entry[0].length > 0 && entry[1].length > 0,
        ),
    );

    let tags: Tag[] = [];

    // Handle tag validation and creation
    if (normalizedTagNames.length > 0) {
      for (const normalized of normalizedTagNames) {
        if (!PRESET_TAG_NAME_SET.has(normalized)) {
          throw new BadRequestException(
            'One or more selected tags are not allowed.',
          );
        }
      }

      const existingTags = await this.tagRepo
        .createQueryBuilder('tag')
        .where('LOWER(tag.name) IN (:...names)', { names: normalizedTagNames })
        .andWhere('tag.user_id = :userId', { userId: user_id })
        .getMany();

      const existingLookup = new Set(
        existingTags.map((tag) => tag.name.trim().toLowerCase()),
      );

      const tagsToCreate = normalizedTagNames
        .filter((name) => !existingLookup.has(name))
        .map((name) =>
          this.tagRepo.create({
            name: tagLabelMap.get(name) ?? name,
            user: { user_id } as any,
          }),
        );

      const createdTags = tagsToCreate.length
        ? await this.tagRepo.save(tagsToCreate)
        : [];

      tags = [...existingTags, ...createdTags];
    } else {
      // If using tag IDs instead of names
      const tagIds = (tag_ids ?? [])
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id));

      if (tagIds.length === 0) {
        throw new BadRequestException(
          'Please select at least one tag for this item.',
        );
      }

      const uniqueTagIds = Array.from(new Set(tagIds));
      tags = await this.tagRepo.find({
        where: { tag_id: In(uniqueTagIds) },
      });

      if (tags.length !== uniqueTagIds.length) {
        throw new BadRequestException(
          'One or more provided tags could not be found.',
        );
      }
    }

    if (!tags.length) {
      throw new BadRequestException(
        'Please select at least one tag for this item.',
      );
    }

    // Handle image upload if provided as base64
    let storedImageUrl = image_url ?? null;
    if (storedImageUrl && storedImageUrl.startsWith('data:image')) {
      storedImageUrl = await this.storeBase64Image(storedImageUrl);
    }

    // Save clothing item
    const newItem = this.repo.create({
      name,
      category,
      image_url: storedImageUrl ?? undefined,
      color,
      user: { user_id } as any,
    });

    const savedItem = await this.repo.save(newItem);

    // Link tags to item
    const tagLinks = tags.map((tag) =>
      this.clothingItemTagRepo.create({
        clothing_item: savedItem,
        tag,
      }),
    );
    await this.clothingItemTagRepo.save(tagLinks);

    // Reload with relationships
    const createdWithRelations = await this.repo.findOne({
      where: { item_id: savedItem.item_id },
      relations: ['user', 'clothing_item_tags', 'clothing_item_tags.tag'],
    });

    if (!createdWithRelations) {
      throw new NotFoundException('Unable to load created clothing item.');
    }

    return {
      message: 'Clothing item created successfully',
      item: this.mapWithTags(createdWithRelations as ClothingItemWithTags),
    };
  }

  // ---------------------------------------------------------------------
  // 🔹 UPDATE OPERATION
  // ---------------------------------------------------------------------

  /**
   * Updates an existing clothing item by ID.
   *
   * @param id - ID of the clothing item to update.
   * @param dto - Fields to update (partial update allowed).
   * @returns Updated item with success message.
   *
   * 🔹 Preconditions:
   * - The item must exist.
   * - The provided data must pass validation.
   *
   * 🔹 Postconditions:
   * - Database record is updated and returned.
   */
  async update(
    id: number,
    dto: UpdateClothingItemDto,
  ): Promise<{ message: string; item: ClothingItemResponse }> {
    const item = await this.repo.findOne({ where: { item_id: id } });
    if (!item) throw new NotFoundException('Clothing item not found.');

    if (dto.name) item.name = dto.name;
    if (dto.category) item.category = dto.category;
    if (dto.color) item.color = dto.color;

    if (dto.image_url) {
      item.image_url = dto.image_url.startsWith('data:image')
        ? await this.storeBase64Image(dto.image_url)
        : dto.image_url;
    }

    if (dto.user_id) item.user = { user_id: dto.user_id } as any;

    const updated = await this.repo.save(item);
    const updatedWithRelations = await this.repo.findOne({
      where: { item_id: updated.item_id },
      relations: ['user', 'clothing_item_tags', 'clothing_item_tags.tag'],
    });

    if (!updatedWithRelations) {
      throw new NotFoundException('Unable to load updated clothing item.');
    }

    return {
      message: 'Clothing item updated successfully',
      item: this.mapWithTags(updatedWithRelations as ClothingItemWithTags),
    };
  }

  // ---------------------------------------------------------------------
  // 🔹 DELETE OPERATION
  // ---------------------------------------------------------------------

  /**
   * Deletes a clothing item by ID.
   *
   * @param id - ID of the clothing item to delete.
   * @returns Confirmation message.
   *
   * 🔹 Preconditions:
   * - The item must exist.
   *
   * 🔹 Postconditions:
   * - The record is permanently removed from the database.
   */
  async delete(id: number) {
    const result = await this.repo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Clothing item not found.');
    return { message: 'Clothing item deleted successfully' };
  }
}
