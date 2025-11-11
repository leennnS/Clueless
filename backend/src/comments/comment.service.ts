/**
 * 💬 Service: CommentService
 *
 * Handles the business logic and data management for user comments on outfits.
 * This service interacts with the database through TypeORM repositories for
 * `Comment`, `User`, and `Outfit` entities.
 *
 * 🔹 Purpose:
 * - Create, retrieve, update, and delete comments.
 * - Enforce data integrity by validating user and outfit references.
 * - Manage comment ordering, relationships, and error handling.
 *
 * 🔹 Related Components:
 * - `comment.controller.ts` → API route definitions.
 * - `comment.entity.ts` → Database schema.
 * - `create-comment.dto.ts`, `update-comment.dto.ts` → Input validation.
 *
 * 🔹 Repositories Injected:
 * - `CommentRepository` → CRUD operations on comments.
 * - `UserRepository` → Validate existing user ownership.
 * - `OutfitRepository` → Validate referenced outfit.
 *
 * 🔹 Preconditions:
 * - Users and outfits referenced by comments must exist.
 *
 * 🔹 Postconditions:
 * - Comments are persisted, retrievable, editable, or removable as required.
 */

import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../user/user.entity';
import { Outfit } from '../outfit/outfit.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Outfit)
    private readonly outfitRepo: Repository<Outfit>,
  ) {}

  /**
   * ➕ Creates a new comment linked to a user and outfit.
   *
   * @param dto - Object containing `user_id`, `outfit_id`, and `comment_text`.
   * @returns The newly created comment record.
   *
   * 🔹 Precondition:
   * - The specified user and outfit must exist in the database.
   *
   * 🔹 Postcondition:
   * - A new comment is saved and linked to the user and outfit.
   */
  async create(dto: CreateCommentDto): Promise<Comment> {
    const user = await this.userRepo.findOne({
      where: { user_id: dto.user_id },
    });
    const outfit = await this.outfitRepo.findOne({
      where: { outfit_id: dto.outfit_id },
    });

    if (!user) throw new NotFoundException('User not found.');
    if (!outfit) throw new NotFoundException('Outfit not found.');

    const comment = this.commentRepo.create({
      user,
      outfit,
      comment_text: dto.comment_text,
    });

    try {
      return await this.commentRepo.save(comment);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create comment.');
    }
  }

  /**
   * 📋 Retrieves all comments associated with a specific outfit.
   *
   * @param outfit_id - ID of the outfit.
   * @returns Array of comments ordered by creation date (newest first).
   *
   * 🔹 Precondition:
   * - The outfit must exist in the database.
   *
   * 🔹 Postcondition:
   * - Returns all comments linked to the specified outfit.
   */
  async findAllByOutfit(outfit_id: number): Promise<Comment[]> {
    return this.commentRepo.find({
      where: { outfit: { outfit_id } },
      relations: ['user', 'outfit'],
      order: { created_at: 'DESC' },
    });
  }

  /**
   * 🔍 Retrieves a single comment by its unique ID.
   *
   * @param id - Comment ID.
   * @returns The found comment record with its relations.
   *
   * 🔹 Postcondition:
   * - Returns the comment or throws a NotFoundException if not found.
   */
  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepo.findOne({
      where: { comment_id: id },
      relations: ['user', 'outfit'],
    });
    if (!comment) throw new NotFoundException('Comment not found.');
    return comment;
  }

  /**
   * ✏️ Updates an existing comment.
   *
   * @param id - ID of the comment to update.
   * @param dto - Object containing updated `comment_text` (optional).
   * @returns The updated comment record.
   *
   * 🔹 Precondition:
   * - The comment must exist before updating.
   *
   * 🔹 Postcondition:
   * - Comment text is updated in the database.
   */
  async update(id: number, dto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.findOne(id);
    Object.assign(comment, dto);
    return await this.commentRepo.save(comment);
  }

  /**
   * ❌ Deletes a comment by its ID.
   *
   * @param id - ID of the comment to delete.
   *
   * 🔹 Precondition:
   * - The comment must exist in the database.
   *
   * 🔹 Postcondition:
   * - Comment is permanently removed.
   * - Throws NotFoundException if it doesn’t exist.
   */
  async delete(id: number): Promise<void> {
    const result = await this.commentRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Comment not found.');
  }
}
