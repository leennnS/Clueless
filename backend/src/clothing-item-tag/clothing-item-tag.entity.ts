/**
 * 🔗 Entity: ClothingItemTag
 *
 * Represents the junction (bridge) table that links `ClothingItem` and `Tag`
 * entities, creating a many-to-many relationship between wardrobe items
 * and their associated tags.
 *
 * 🔹 Table Name: `clothing_item_tags`
 *
 * 🔹 Purpose:
 * - Each record corresponds to one tag assignment for one clothing item.
 * - Ensures referential integrity between the `clothing_items` and `tags` tables.
 *
 * 🔹 Relationships:
 * - ManyToOne → `ClothingItem`
 * - ManyToOne → `Tag`
 *
 * 🔹 Cascade Behavior:
 * - When a clothing item or tag is deleted, its related records in this table
 *   are automatically removed (`onDelete: 'CASCADE'`).
 *
 * 🔹 Lifecycle Column:
 * - `created_at`: timestamp automatically set when the relation is created.
 *
 * 🔹 Preconditions:
 * - Both the referenced clothing item and tag must exist in their parent tables.
 *
 * 🔹 Postconditions:
 * - The association between item and tag is stored persistently.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ClothingItem } from '../clothing-item/clothing-item.entity';
import { Tag } from '../tag/tag.entity';

@Entity('clothing_item_tags')
export class ClothingItemTag {
  /**
   * 🔑 Primary key for the junction table.
   * Auto-incremented numeric identifier.
   * @example 12
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 🧥 Many-to-One relationship to the `ClothingItem` entity.
   * Each link entry references one clothing item.
   * Deletion of the item cascades to remove related tags.
   */
  @ManyToOne(() => ClothingItem, (item) => item.clothing_item_tags, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'item_id' })
  clothing_item: ClothingItem;

  /**
   * 🔖 Many-to-One relationship to the `Tag` entity.
   * Each link entry references one tag.
   * Deletion of the tag cascades to remove related associations.
   */
  @ManyToOne(() => Tag, (tag) => tag.clothing_item_tags, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

  /**
   * 🕒 Timestamp automatically set when the record is created.
   * Useful for tracking when the tag was associated with an item.
   */
  @CreateDateColumn()
  created_at: Date;
}
