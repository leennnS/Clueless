/**
 * Entity: ScheduledOutfit
 *
 * Represents a scheduled outfit record, linking a specific outfit
 * to a user and assigning it a scheduled calendar date.
 *
 * Each record indicates when a user plans to wear a particular outfit.
 * This entity supports use cases such as outfit planning, reminders,
 * and scheduling for events or daily look preparation.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Outfit } from '../outfit/outfit.entity';

@Entity('scheduled_outfits')
export class ScheduledOutfit {
  /** Auto-generated unique identifier for the scheduled outfit. */
  @PrimaryGeneratedColumn()
  schedule_id: number;

  // ---------------------------------------------------------------------------
  // RELATIONS
  // ---------------------------------------------------------------------------

  /**
   * Many scheduled outfits reference a single outfit.
   * When the related outfit is deleted, its scheduled records are removed.
   */
  @ManyToOne(() => Outfit, (outfit) => outfit.scheduled_outfits, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'outfit_id' })
  outfit: Outfit;

  /**
   * Many scheduled outfits belong to one user.
   * When the user is deleted, all their scheduled outfits are also deleted.
   */
  @ManyToOne(() => User, (user) => user.scheduled_outfits, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // ---------------------------------------------------------------------------
  // PROPERTIES
  // ---------------------------------------------------------------------------

  /**
   * The specific calendar date when this outfit is scheduled.
   *
   * Example: 2025-11-15
   */
  @Column({ type: 'date', name: 'schedule_date', nullable: false })
  schedule_date: Date;

  /**
   * Timestamp automatically set when the schedule is created.
   * Stored with timezone awareness for consistency across regions.
   */
  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  created_at: Date;
}

/**
 * Preconditions:
 * - The referenced `user` and `outfit` must exist in their respective tables.
 *
 * Postconditions:
 * - A persistent record links the user, outfit, and scheduled date.
 */
