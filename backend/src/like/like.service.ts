/**
 * ❤️ Service: LikesService
 *
 * Handles all business logic related to outfit likes.
 * This service connects users and outfits through the `Like` entity
 * and supports creating, toggling, deleting, and retrieving likes.
 *
 * 🔹 Purpose:
 * - Manage database operations for user likes.
 * - Enforce one-like-per-user-per-outfit rule.
 * - Handle toggle (like/unlike) functionality.
 *
 * 🔹 Related Components:
 * - `like.controller.ts` → API endpoints for likes.
 * - `like.entity.ts` → Database schema for like records.
 * - `create-like.dto.ts`, `delete-like.dto.ts` → Input validation.
 *
 * 🔹 Dependencies:
 * - Injects the `Like` repository through TypeORM.
 *
 * 🔹 Preconditions:
 * - Both `User` and `Outfit` referenced must exist before a like can be created.
 *
 * 🔹 Postconditions:
 * - Likes are added, toggled, or removed persistently in the database.
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { CreateLikeInput } from './dto/create-like.input';
import { MessagePayload } from '../user/user.types';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly repo: Repository<Like>,
  ) {}

  /**
   * 🕵️ Private helper — Finds an existing like between a user and outfit.
   *
   * @param user_id - ID of the liking user.
   * @param outfit_id - ID of the liked outfit.
   * @returns The like record if found, otherwise null.
   *
   * 🔹 Used internally for `create()` and `toggle()` checks.
   */
  private async findByUserAndOutfit(
    user_id: number,
    outfit_id: number,
  ): Promise<Like | null> {
    return this.repo.findOne({
      where: { user: { user_id }, outfit: { outfit_id } },
      relations: ['user', 'outfit', 'outfit.user'],
    });
  }

  /**
   * 📋 Retrieves all likes in the database.
   *
   * @returns Array of all like records with related user and outfit data.
   */
  async getAll(): Promise<Like[]> {
    return this.repo.find({ relations: ['user', 'outfit', 'outfit.user'] });
  }

  /**
   * 🔍 Retrieves a single like by its ID.
   *
   * @param id - The unique ID of the like record.
   * @returns The like record with relations.
   *
   * 🔹 Postcondition:
   * - Returns the like if found or throws a NotFoundException if not.
   */
  async getById(id: number): Promise<Like> {
    const like = await this.repo.findOne({
      where: { like_id: id },
      relations: ['user', 'outfit', 'outfit.user'],
    });
    if (!like) throw new NotFoundException('Like not found');
    return like;
  }

  /**
   * 🧍 Retrieves all likes made by a specific user.
   *
   * @param user_id - The user’s ID.
   * @returns Array of outfits the user liked.
   *
   * 🔹 Postcondition:
   * - Returns all likes associated with the given user.
   */
  async getByUser(user_id: number): Promise<Like[]> {
    return this.repo.find({
      where: { user: { user_id } },
      relations: ['user', 'outfit', 'outfit.user'],
      order: { created_at: 'DESC' },
    });
  }

  /**
   * 👗 Retrieves all likes received by a specific creator’s outfits.
   *
   * @param user_id - The creator’s user ID.
   * @returns Array of likes on outfits belonging to the creator.
   */
  async getForCreator(user_id: number): Promise<Like[]> {
    return this.repo.find({
      where: { outfit: { user: { user_id } } },
      relations: ['user', 'outfit', 'outfit.user'],
      order: { created_at: 'DESC' },
    });
  }

  /**
   * ❤️ Creates a like between a user and an outfit.
   *
   * @param user_id - The user’s ID.
   * @param outfit_id - The outfit’s ID.
   * @returns A confirmation object with the created like.
   *
   * 🔹 Precondition:
   * - The user and outfit must exist.
   * - The user cannot like the same outfit twice.
   *
   * 🔹 Postcondition:
   * - A new like record is created, or an existing one is returned.
   */
  async create(user_id: number, outfit_id: number): Promise<{
    message: string;
    like?: Like;
    liked: boolean;
  }> {
    const existing = await this.findByUserAndOutfit(user_id, outfit_id);
    if (existing) {
      return {
        message: 'Like already exists',
        like: existing,
        liked: true,
      };
    }

    const newLike = this.repo.create({
      user: { user_id },
      outfit: { outfit_id },
    });
    const saved = await this.repo.save(newLike);
    const likeWithRelations = await this.getById(saved.like_id);
    return {
      message: 'Like created successfully',
      like: likeWithRelations,
      liked: true,
    };
  }

  /**
   * 🔁 Toggles a like for a user and outfit.
   *
   * @param user_id - The user’s ID.
   * @param outfit_id - The outfit’s ID.
   * @returns Object indicating whether the outfit is now liked or unliked.
   *
   * 🔹 Behavior:
   * - If a like exists → remove it (unlike).
   * - If not → create a new like.
   */
  async toggle(user_id: number, outfit_id: number): Promise<{
    message: string;
    like?: Like;
    liked: boolean;
  }> {
    const existing = await this.findByUserAndOutfit(user_id, outfit_id);
    if (existing) {
      await this.repo.delete(existing.like_id);
      return { message: 'Like removed successfully', liked: false };
    }

    const created = await this.repo.save(
      this.repo.create({ user: { user_id }, outfit: { outfit_id } }),
    );
    const likeWithRelations = await this.getById(created.like_id);

    return {
      message: 'Like created successfully',
      like: likeWithRelations,
      liked: true,
    };
  }

  /**
   * ❌ Deletes a like record by ID.
   *
   * @param id - The like’s unique identifier.
   * @returns Confirmation message after deletion.
   *
   * 🔹 Postcondition:
   * - The like record is permanently removed.
   * - Throws NotFoundException if the record doesn’t exist.
   */
  async delete(id: number): Promise<MessagePayload> {
    const result = await this.repo.delete(id);
    if (!result.affected) throw new NotFoundException('Like not found');
    return { message: 'Like deleted successfully' };
  }
}
