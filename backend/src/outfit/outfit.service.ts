/**
 * Service: OutfitService
 *
 * Handles all operations related to user outfits, including creation,
 * updates, retrieval, deletion, and generation of the public outfit feed.
 * 
 * This service acts as the business logic layer between the controller
 * and the database repository, ensuring proper validation, query handling,
 * and structured data responses.
 */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Outfit } from './outfit.entity';
import { CreateOutfitInput } from './dto/create-outfit.dto';
import { UpdateOutfitInput } from './dto/update-outfit.dto';
import { OutfitPayload } from './outfit.types';
import { BasicUserSummary } from '../clothing-item/clothing-item.types';
import { MessagePayload } from '../user/user.types';

@Injectable()
export class OutfitService {
  constructor(
    @InjectRepository(Outfit)
    private readonly repo: Repository<Outfit>,
  ) {}

  // ---------------------------------------------------------------------------
  // GET ALL
  // ---------------------------------------------------------------------------

  /**
   * Retrieves all outfits in the system.
   *
   * Used primarily for administrative or debugging purposes.
   * Includes related user data for each outfit.
   *
   * @returns List of all outfits with their associated users.
   */
  async getAll(): Promise<OutfitPayload[]> {
    const outfits = await this.repo.find({ relations: ['user'] });
    return outfits.map((o) => this.mapPayload(o));
  }

  // ---------------------------------------------------------------------------
  // PUBLIC FEED
  // ---------------------------------------------------------------------------

  /**
   * Retrieves the public feed of outfits.
   *
   * Includes only outfits marked as public. Supports text-based search
   * (on outfit name, creator username, or email) and indicates whether
   * the requesting viewer has liked each outfit.
   *
   * @param search Optional text query to filter by name or creator.
   * @param viewerId Optional user ID to check if the viewer liked the outfit.
   * @returns Array of public outfits with like and comment counts.
   *
   * Preconditions:
   * - If provided, `viewerId` must correspond to a valid user.
   *
   * Postconditions:
   * - Returns a structured list containing metadata such as `like_count`,
   *   `comment_count`, and `liked_by_viewer`.
   */
  async getPublicFeed(search?: string, viewerId?: number): Promise<OutfitPayload[]> {
    const qb = this.repo
      .createQueryBuilder('outfit')
      .leftJoinAndSelect('outfit.user', 'user')
      .where('outfit.is_public = :isPublic', { isPublic: true })
      .orderBy('outfit.created_at', 'DESC')
      .loadRelationCountAndMap('outfit.likeCount', 'outfit.likes')
      .loadRelationCountAndMap('outfit.commentCount', 'outfit.comments');

    const trimmedSearch = search?.trim().toLowerCase();
    if (trimmedSearch) {
      qb.andWhere(
        "(LOWER(outfit.name) LIKE :search OR LOWER(user.username) LIKE :search OR LOWER(COALESCE(user.email, '')) LIKE :search)",
        { search: `%${trimmedSearch}%` },
      );
    }

    if (typeof viewerId === 'number' && Number.isFinite(viewerId)) {
      qb.loadRelationCountAndMap(
        'outfit.viewerLikeCount',
        'outfit.likes',
        'viewerLike',
        (viewerQb) =>
          viewerQb.andWhere('viewerLike.user_id = :viewerId', { viewerId }),
      );
    }

    const outfits = await qb.getMany();

    return outfits.map((outfit: any) => {
      const { likeCount = 0, commentCount = 0, viewerLikeCount = 0 } = outfit;
      const payload = this.mapPayload(outfit);
      payload.like_count = likeCount ?? 0;
      payload.comment_count = commentCount ?? 0;
      payload.liked_by_viewer = viewerLikeCount > 0;
      return payload;
    });
  }

  // ---------------------------------------------------------------------------
  // GET BY ID
  // ---------------------------------------------------------------------------

  /**
   * Retrieves a single outfit by its unique identifier.
   *
   * @param id Outfit ID to retrieve.
   * @returns The matching outfit, if found.
   *
   * Preconditions:
   * - The provided `id` must be a valid numeric identifier.
   *
   * Postconditions:
   * - Throws `NotFoundException` if no outfit exists for this ID.
   */
  async getById(id: number): Promise<OutfitPayload> {
    const outfit = await this.repo.findOne({
      where: { outfit_id: id },
      relations: ['user'],
    });
    if (!outfit) throw new NotFoundException('Outfit not found.');
    return this.mapPayload(outfit);
  }

  // ---------------------------------------------------------------------------
  // GET BY USER
  // ---------------------------------------------------------------------------

  /**
   * Retrieves all outfits created by a specific user.
   *
   * @param user_id The unique identifier of the user.
   * @returns List of outfits created by the given user.
   *
   * Postconditions:
   * - Throws `NotFoundException` if the user has no outfits.
   */
  async getByUser(user_id: number): Promise<OutfitPayload[]> {
    const outfits = await this.repo.find({
      where: { user: { user_id } },
      relations: ['user'],
    });
    return outfits.map((o) => this.mapPayload(o));
  }

  // ---------------------------------------------------------------------------
  // CREATE
  // ---------------------------------------------------------------------------

  /**
   * Creates a new outfit associated with a user.
   *
   * @param dto Data Transfer Object containing outfit details.
   * @returns The newly created outfit and a confirmation message.
   *
   * Preconditions:
   * - `user_id` must be provided and valid.
   *
   * Postconditions:
   * - A new outfit record is saved in the database.
   */
  async create(dto: CreateOutfitInput): Promise<{ message: string; outfit: OutfitPayload }> {
    const { name, is_public, cover_image_url, user_id } = dto;

    if (!user_id)
      throw new BadRequestException('Missing required field: user_id');

    const outfit = this.repo.create({
      name,
      is_public: is_public ?? false,
      cover_image_url,
      user: { user_id } as any,
    });

    const saved = await this.repo.save(outfit);
    return {
      message: 'Outfit created successfully',
      outfit: this.mapPayload(saved),
    };
  }

  // ---------------------------------------------------------------------------
  // UPDATE
  // ---------------------------------------------------------------------------

  /**
   * Updates an existing outfit by its ID.
   *
   * @param id ID of the outfit to update.
   * @param updates Partial data with the fields to modify.
   * @returns The updated outfit and a success message.
   *
   * Preconditions:
   * - The outfit with the given ID must exist.
   *
   * Postconditions:
   * - Outfit details are updated in the database.
   * - Throws `NotFoundException` if no outfit is found.
   */
  async update(id: number, updates: UpdateOutfitInput): Promise<{ message: string; outfit: OutfitPayload }> {
    const outfit = await this.repo.findOne({ where: { outfit_id: id } });
    if (!outfit) throw new NotFoundException('Outfit not found.');

    Object.assign(outfit, updates);
    const updated = await this.repo.save(outfit);

    return {
      message: 'Outfit updated successfully',
      outfit: this.mapPayload(updated),
    };
  }

  // ---------------------------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------------------------

  /**
   * Deletes an outfit permanently by its ID.
   *
   * @param id Outfit ID to delete.
   * @returns Confirmation message upon successful deletion.
   *
   * Preconditions:
   * - The outfit ID must exist in the database.
   *
   * Postconditions:
   * - The outfit and its related records are removed (due to cascade).
   * - Throws `NotFoundException` if the outfit does not exist.
   */
  async delete(id: number): Promise<MessagePayload> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Outfit not found.');
    return { message: 'Outfit deleted successfully' };
  }

  private mapPayload(outfit: Outfit): OutfitPayload {
    const userSummary: BasicUserSummary | undefined = outfit.user
      ? {
          user_id: outfit.user.user_id,
          username: outfit.user.username,
          email: outfit.user.email,
          profile_image_url: outfit.user.profile_image_url,
        }
      : undefined;

    return {
      outfit_id: outfit.outfit_id,
      name: outfit.name,
      is_public: outfit.is_public,
      cover_image_url: outfit.cover_image_url,
      user_id: outfit.user_id,
      user: userSummary,
      created_at: outfit.created_at,
      updated_at: outfit.updated_at,
    };
  }
}
