/**
 * Entity: Tag
 *
 * Represents a user-defined label for organizing and categorizing clothing items.
 * Each tag belongs to a specific user and may be linked to multiple clothing items.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { ClothingItemTag } from '../clothing-item-tag/clothing-item-tag.entity';

@Entity('tags')
export class Tag {
  /** Unique identifier for the tag. */
  @PrimaryGeneratedColumn()
  tag_id: number;

  /** The display name of the tag (e.g., “Summer”, “Formal”, “Streetwear”). */
  @Column()
  name: string;

  /**
   * The user who owns this tag.
   * A tag is always associated with a single user.
   * Deleting the user cascades and removes their tags.
   */
  @ManyToOne(() => User, (user) => user.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /**
   * Many-to-many link table mapping this tag to clothing items.
   * Managed through the intermediate `clothing_item_tags` relation.
   */
  @OneToMany(() => ClothingItemTag, (cit) => cit.tag)
  clothing_item_tags: ClothingItemTag[];

  /** Timestamp when the tag was first created. */
  @CreateDateColumn()
  created_at: Date;

  /** Timestamp when the tag was last updated. */
  @UpdateDateColumn()
  updated_at: Date;
}

/**
 * Postconditions:
 * - Tags can be safely deleted when the owning user is removed (cascade).
 * - Maintains a bidirectional link with `ClothingItemTag` for wardrobe categorization.
 */
