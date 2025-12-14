import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduledOutfit } from './scheduled-outfit.entity';
import { CreateScheduledOutfitInput } from './dto/create-scheduled-outfit.dto';
import { UpdateScheduledOutfitInput } from './dto/update-scheduled-outfit.dto';
import { User } from '../user/user.entity';
import { Outfit } from '../outfit/outfit.entity';
import { ScheduledOutfitPayload, ScheduledOutfitWithMessage } from './scheduled-outfit.types';
import { BasicUserSummary } from '../clothing-item/clothing-item.types';
import { MessagePayload } from '../user/user.types';

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
   */
  async create(dto: CreateScheduledOutfitInput): Promise<ScheduledOutfitWithMessage> {
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
      schedule_date: new Date(dto.schedule_date),
    });

    try {
      const saved = await this.scheduledOutfitRepo.save(scheduled);
      const entity = await this.loadWithRelations(saved.schedule_id);
      return {
        message: 'Scheduled outfit created successfully',
        scheduled_outfit: this.mapPayload(entity),
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to schedule outfit.');
    }
  }

  // ---------------------------------------------------------------------------
  // READ (ALL + BY USER + BY ID)
  // ---------------------------------------------------------------------------

  async findAll(): Promise<ScheduledOutfitPayload[]> {
    const scheduled = await this.scheduledOutfitRepo.find({
      relations: ['outfit', 'outfit.user', 'user'],
      order: { schedule_date: 'ASC' },
    });
    return scheduled.map((item) => this.mapPayload(item));
  }

  /**
   * Retrieves all scheduled outfits for a given user.
   */
  async findAllByUser(user_id: number): Promise<ScheduledOutfitPayload[]> {
    const scheduled = await this.scheduledOutfitRepo.find({
      where: { user: { user_id } },
      relations: ['outfit', 'outfit.user', 'user'],
      order: { schedule_date: 'ASC' },
    });
    return scheduled.map((item) => this.mapPayload(item));
  }

  /**
   * Retrieves a specific scheduled outfit by its ID.
   */
  async findOne(id: number): Promise<ScheduledOutfitPayload> {
    const entity = await this.loadWithRelations(id);
    return this.mapPayload(entity);
  }

  // ---------------------------------------------------------------------------
  // UPDATE
  // ---------------------------------------------------------------------------

  /**
   * Updates the schedule date of an existing scheduled outfit.
   */
  async update(dto: UpdateScheduledOutfitInput): Promise<ScheduledOutfitWithMessage> {
    const existing = await this.loadWithRelations(dto.schedule_id);
    if (dto.schedule_date !== undefined) {
      existing.schedule_date = new Date(dto.schedule_date);
    }
    const saved = await this.scheduledOutfitRepo.save(existing);
    const entity = await this.loadWithRelations(saved.schedule_id);
    return {
      message: 'Scheduled outfit updated successfully',
      scheduled_outfit: this.mapPayload(entity),
    };
  }

  // ---------------------------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------------------------

  /**
   * Deletes a scheduled outfit by its unique ID.
   */
  async delete(id: number): Promise<MessagePayload> {
    const result = await this.scheduledOutfitRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Scheduled outfit not found.');
    return { message: 'Scheduled outfit deleted successfully' };
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private async loadWithRelations(id: number): Promise<ScheduledOutfit> {
    const scheduled = await this.scheduledOutfitRepo.findOne({
      where: { schedule_id: id },
      relations: ['outfit', 'outfit.user', 'user'],
    });

    if (!scheduled) throw new NotFoundException('Scheduled outfit not found.');
    return scheduled;
  }

  private mapPayload(entity: ScheduledOutfit): ScheduledOutfitPayload {
    const userSummary: BasicUserSummary | undefined = entity.user
      ? {
          user_id: entity.user.user_id,
          username: entity.user.username,
          email: entity.user.email,
          profile_image_url: entity.user.profile_image_url,
        }
      : undefined;

    const scheduleDate = this.normalizeDate(entity.schedule_date);
    const createdAt = this.normalizeDate(entity.created_at);

    return {
      schedule_id: entity.schedule_id,
      user_id: entity.user?.user_id ?? (entity as any).user_id,
      outfit_id: entity.outfit?.outfit_id ?? (entity as any).outfit_id,
      schedule_date: scheduleDate,
      created_at: createdAt,
      user: userSummary,
      outfit: entity.outfit,
    };
  }

  private normalizeDate(value?: Date | string | null): Date {
    if (value instanceof Date) {
      return value;
    }
    if (typeof value === 'string' && value.length > 0) {
      const parsed =
        value.length === 10
          ? new Date(`${value}T00:00:00.000Z`)
          : new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    throw new InternalServerErrorException('Invalid date value encountered.');
  }
}
