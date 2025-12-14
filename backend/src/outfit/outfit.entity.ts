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
import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { OutfitItem } from '../outfit-item/outfit-item.entity';
import { ScheduledOutfit } from '../scheduled-outfit/scheduled-outfit.entity';
import { Comment } from '../comments/comment.entity';
import { Like } from '../like/like.entity';

@Entity('outfits')
@ObjectType()
export class Outfit {
  /** Primary key — unique identifier for each outfit. */
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  outfit_id: number;

  /** Optional name assigned by the user (e.g., “Summer Vibes”). */
  @Column({ nullable: true })
  @Field({ nullable: true })
  name: string;

  /** Indicates whether the outfit is visible to other users. */
  @Column({ default: false })
  @Field()
  is_public: boolean;

 /** URL or Base64-encoded string of the outfit’s cover image. */
@Column({ name: 'cover_image_url', type: 'text', nullable: true })
@Field(() => String, { nullable: true })
cover_image_url?: string;

  /**
   * The user who created this outfit.
   * Deleting a user cascades and removes all associated outfits.
   */
  @ManyToOne(() => User, (user) => user.outfits, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  @Field(() => User)
  user: User;

  /** Foreign key referencing the owning user's ID. */
  @RelationId((outfit: Outfit) => outfit.user)
  @Field(() => Int)
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
  @Field()
  created_at: Date;

  /** Date and time when the outfit was last updated. */
  @UpdateDateColumn({ name: 'updated_at' })
  @Field()
  updated_at: Date;

  @Field(() => Int, { nullable: true })
  like_count?: number;

  @Field(() => Int, { nullable: true })
  comment_count?: number;

  @Field({ nullable: true })
  liked_by_viewer?: boolean;
}
