/**
 * Service: TagsService
 *
 * Handles business logic for user-defined tags.
 * Supports creation, retrieval, updating, and deletion of tags associated with clothing items.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private repo: Repository<Tag>) {}

  // ---------- GET ALL ----------
  /**
   * Retrieves all tags in the system along with their owners.
   *
   * Postconditions:
   * - Returns an array of Tag entities, each including the related user.
   */
  async findAll() {
    return this.repo.find({ relations: ['user'] });
  }

  // ---------- GET ONE ----------
  /**
   * Retrieves a single tag by its ID.
   *
   * @param id - Tag identifier.
   *
   * Preconditions:
   * - Tag with the given ID must exist.
   *
   * Postconditions:
   * - Returns the tag entity or throws `NotFoundException` if not found.
   */
  async findOne(id: number) {
    const tag = await this.repo.findOne({
      where: { tag_id: id },
      relations: ['user'],
    });
    if (!tag) throw new NotFoundException('Tag not found');
    return tag;
  }

  // ---------- CREATE ----------
  /**
   * Creates a new tag associated with a user.
   *
   * @param dto - Contains `name` and `user_id` for the new tag.
   *
   * Preconditions:
   * - The referenced user must exist in the system.
   *
   * Postconditions:
   * - A new tag is saved in the database and returned.
   */
  async create(dto: CreateTagDto) {
    const { name, user_id } = dto;
    const tag = this.repo.create({
      name,
      user: { user_id } as any,
    });
    const saved = await this.repo.save(tag);
    return { message: 'Tag created successfully', tag: saved };
  }

  // ---------- UPDATE ----------
  /**
   * Updates an existing tag with new data.
   *
   * @param id - Tag identifier.
   * @param dto - Fields to update (e.g., name or user_id).
   *
   * Postconditions:
   * - The tag is updated and saved back to the database.
   * - Throws `NotFoundException` if the tag does not exist.
   */
  async update(id: number, dto: UpdateTagDto) {
    const tag = await this.findOne(id);
    Object.assign(tag, dto);
    const updated = await this.repo.save(tag);
    return { message: 'Tag updated successfully', tag: updated };
  }

  // ---------- DELETE ----------
  /**
   * Deletes a tag permanently.
   *
   * @param id - Tag identifier.
   *
   * Postconditions:
   * - Tag is removed from the database if it exists.
   * - Throws `NotFoundException` if no tag matches the given ID.
   */
  async delete(id: number) {
    const result = await this.repo.delete(id);
    if (!result.affected) throw new NotFoundException('Tag not found');
    return { message: 'Tag deleted successfully' };
  }
}
