/**
 * Entity: User
 *
 * Represents an individual user within the system.
 * Stores authentication credentials, profile details, and manages relations
 * with all user-generated content such as outfits, clothing items, tags,
 * likes, comments, and scheduled outfits.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ClothingItem } from '../clothing-item/clothing-item.entity';
import { Outfit } from '../outfit/outfit.entity';
import { ScheduledOutfit } from '../scheduled-outfit/scheduled-outfit.entity';
import { Comment } from '../comments/comment.entity';
import { Tag } from '../tag/tag.entity';
import { Like } from '../like/like.entity';
import { PasswordResetToken } from './password-reset-token.entity';

@Entity('users')
export class User {
  /** Unique auto-incrementing identifier for each user record */
  @PrimaryGeneratedColumn()
  user_id: number;

  /** Unique username chosen by the user */
  @Column({ unique: true })
  username: string;

  /** Unique email address associated with the user account */
  @Column({ unique: true })
  email: string;

  /** Securely hashed version of the user's password */
  @Column({ nullable: true })
  password_hash?: string;

  /** Optional profile image URL or base64-encoded string */
  @Column({ name: 'profile_image_url', type: 'text', nullable: true })
  profile_image_url?: string | null;

  /** Timestamp marking when the user account was created */
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  /** Timestamp of the latest user data update */
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  // ----------- RELATIONS -----------

  /** User’s uploaded clothing items (wardrobe inventory) */
  @OneToMany(() => ClothingItem, (item) => item.user, {
    cascade: true,
  })
  clothing_items: ClothingItem[];

  /** Outfits created by this user */
  @OneToMany(() => Outfit, (outfit) => outfit.user)
  outfits: Outfit[];

  /** Scheduled outfits planned by the user */
  @OneToMany(() => ScheduledOutfit, (scheduled) => scheduled.user)
  scheduled_outfits: ScheduledOutfit[];

  /** Comments written by the user */
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  /** Tags created and owned by the user */
  @OneToMany(() => Tag, (tag) => tag.user, { cascade: true })
  tags: Tag[];

  /** Likes given by the user to public outfits */
  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  /** Password reset tokens generated for this user's account */
  @OneToMany(
    () => PasswordResetToken,
    (passwordResetToken) => passwordResetToken.user,
  )
  password_reset_tokens: PasswordResetToken[];
}
