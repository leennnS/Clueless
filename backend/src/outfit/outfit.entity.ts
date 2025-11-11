/**
 * Entity: Outfit
 * 
 * Represents a user-created outfit within the application.
 * Each outfit is owned by a user and may include multiple clothing items,
 * likes, comments, and scheduled appearances on a calendar.
 * 
 * This entity is central to user wardrobe management and community features,
 * linking user-generated fashion combinations with social interactions.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { User } from '../user/user.entity';
import { OutfitItem } from '../outfit-item/outfit-item.entity';
import { ScheduledOutfit } from '../scheduled-outfit/scheduled-outfit.entity';
import { Comment } from '../comments/comment.entity';
import { Like } from '../like/like.entity';

@Entity('outfits')
export class Outfit {
  /** Primary key — unique identifier for each outfit. */
  @PrimaryGeneratedColumn()
  outfit_id: number;

  /** Optional name assigned by the user (e.g., “Summer Vibes”). */
  @Column({ nullable: true })
  name: string;

  /** Indicates whether the outfit is visible to other users. */
  @Column({ default: false })
  is_public: boolean;

  /** URL or Base64-encoded string of the outfit’s cover image. */
  @Column({ name: 'cover_image_url', type: 'text', nullable: true })
  cover_image_url?: string | null;

  // ----------- RELATIONS -----------

  /**
   * The user who created this outfit.
   * Deleting a user cascades and removes all associated outfits.
   */
  @ManyToOne(() => User, (user) => user.outfits, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /** Foreign key referencing the owning user's ID. */
  @RelationId((outfit: Outfit) => outfit.user)
  user_id: number;

  /** List of clothing items associated with this outfit. */
  @OneToMany(() => OutfitItem, (outfitItem) => outfitItem.outfit)
  outfit_items: OutfitItem[];

  /** Calendar entries where this outfit is scheduled to be worn. */
  @OneToMany(() => ScheduledOutfit, (scheduled) => scheduled.outfit)
  scheduled_outfits: ScheduledOutfit[];

  /** Comments added by users on this outfit. */
  @OneToMany(() => Comment, (comment) => comment.outfit)
  comments: Comment[];

  /** Likes given to this outfit by users. */
  @OneToMany(() => Like, (like) => like.outfit)
  likes: Like[];

  // ----------- TIMESTAMPS -----------

  /** Date and time when the outfit was created. */
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  /** Date and time when the outfit was last updated. */
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
