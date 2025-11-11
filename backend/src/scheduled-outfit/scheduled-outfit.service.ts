/**
 * Service: ScheduledOutfitService
 *
 * Handles all business logic for managing scheduled outfits.
 * This includes creating, retrieving, updating, and deleting records
 * that link users to specific outfits on scheduled dates.
 *
 * Responsibilities:
 * - Validates user and outfit existence before scheduling.
 * - Provides user-based filtering for scheduled outfits.
 * - Ensures referential integrity when modifying or deleting entries.
 */
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduledOutfit } from './scheduled-outfit.entity';
import { CreateScheduledOutfitDto } from './dto/create-scheduled-outfit.dto';
import { UpdateScheduledOutfitDto } from './dto/update-scheduled-outfit.dto';
import { User } from '../user/user.entity';
import { Outfit } from '../outfit/outfit.entity';

@Injectable()
export class ScheduledOutfitService {
  constructor(
    @InjectRepository(ScheduledOutfit)
    private readonly scheduledOutfitRepo: Repository<ScheduledOutfit>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Outfit)
    private readonly outfitRepo: Repository<Outfit>,
  ) {}

  // ---------------------------------------------------------------------------
  // CREATE
  // ---------------------------------------------------------------------------

  /**
   * Creates a new scheduled outfit entry that links a user and an outfit
   * to a specific date in the calendar.
   *
   * @param dto - Data Transfer Object containing user ID, outfit ID, and schedule date.
   * @returns The created `ScheduledOutfit` entity with relations included.
   *
   * Preconditions:
   * - The referenced user and outfit must exist in the database.
   *
   * Postconditions:
   * - A new record is saved linking the user, outfit, and provided date.
   * - Throws `InternalServerErrorException` if persistence fails.
   */
  async create(dto: CreateScheduledOutfitDto): Promise<ScheduledOutfit> {
    const user = await this.userRepo.findOne({
      where: { user_id: dto.user_id },
    });
    const outfit = await this.outfitRepo.findOne({
      where: { outfit_id: dto.outfit_id },
    });

    if (!user) throw new NotFoundException('User not found.');
    if (!outfit) throw new NotFoundException('Outfit not found.');

    const scheduled = this.scheduledOutfitRepo.create({
      user,
      outfit,
      schedule_date: dto.schedule_date,
    });

    try {
      return await this.scheduledOutfitRepo.save(scheduled);
    } catch (error) {
      throw new InternalServerErrorException('Failed to schedule outfit.');
    }
  }

  // ---------------------------------------------------------------------------
  // READ (BY USER)
  // ---------------------------------------------------------------------------

  /**
   * Retrieves all scheduled outfits for a given user.
   *
   * @param user_id - The user’s unique ID.
   * @returns A list of scheduled outfits, ordered by date.
   *
   * Postconditions:
   * - Returns an empty array if no scheduled outfits exist for this user.
   */
  async findAllByUser(user_id: number): Promise<ScheduledOutfit[]> {
    return this.scheduledOutfitRepo.find({
      where: { user: { user_id } },
      relations: ['outfit', 'user'],
      order: { schedule_date: 'ASC' },
    });
  }

  // ---------------------------------------------------------------------------
  // READ (BY ID)
  // ---------------------------------------------------------------------------

  /**
   * Retrieves a specific scheduled outfit by its ID.
   *
   * @param id - The schedule ID to look up.
   * @returns The corresponding scheduled outfit record with related user and outfit.
   *
   * Postconditions:
   * - Throws `NotFoundException` if the record does not exist.
   */
  async findOne(id: number): Promise<ScheduledOutfit> {
    const scheduled = await this.scheduledOutfitRepo.findOne({
      where: { schedule_id: id },
      relations: ['outfit', 'user'],
    });

    if (!scheduled) throw new NotFoundException('Scheduled outfit not found.');
    return scheduled;
  }

  // ---------------------------------------------------------------------------
  // UPDATE
  // ---------------------------------------------------------------------------

  /**
   * Updates the schedule date of an existing scheduled outfit.
   *
   * @param id - The ID of the scheduled outfit to update.
   * @param dto - The DTO containing updated date information.
   * @returns The updated scheduled outfit entity.
   *
   * Preconditions:
   * - The provided ID must correspond to an existing record.
   *
   * Postconditions:
   * - The schedule_date field is updated to reflect the new date.
   */
  async update(
    id: number,
    dto: UpdateScheduledOutfitDto,
  ): Promise<ScheduledOutfit> {
    const scheduled = await this.findOne(id);
    Object.assign(scheduled, dto);
    return await this.scheduledOutfitRepo.save(scheduled);
  }

  // ---------------------------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------------------------

  /**
   * Deletes a scheduled outfit by its unique ID.
   *
   * @param id - The ID of the scheduled outfit to delete.
   * @throws NotFoundException if the record does not exist.
   *
   * Postconditions:
   * - The scheduled outfit record is permanently removed from the database.
   */
  async delete(id: number): Promise<void> {
    const result = await this.scheduledOutfitRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Scheduled outfit not found.');
  }
}
