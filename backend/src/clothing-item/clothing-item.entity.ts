/**
 * 🧾 Entity: ClothingItem
 *
 * Represents a single clothing piece that belongs to a user within the wardrobe system.
 * This entity maps directly to the `clothing_items` table in the database and defines
 * all relational connections with users, tags, and outfits.
 *
 * 🔹 Table Name: `clothing_items`
 *
 * 🔹 Responsibilities:
 * - Store clothing attributes (name, category, color, image).
 * - Link each item to its owner (`User` entity).
 * - Establish relationships to `ClothingItemTag` and `OutfitItem` entities.
 * - Track creation and modification timestamps.
 *
 * 🔹 Relationships:
 * - ManyToOne → `User` (each clothing item belongs to one user)
 * - OneToMany → `ClothingItemTag` (an item can have multiple tags)
 * - OneToMany → `OutfitItem` (an item can appear in multiple outfits)
 *
 * 🔹 Lifecycle Columns:
 * - `uploaded_at`: date the item was added.
 * - `updated_at`: date the item was last modified.
 *
 * 🔹 Preconditions:
 * - Every clothing item must be associated with a valid user.
 * - `name` and `category` are required non-empty strings.
 *
 * 🔹 Postconditions:
 * - When a user is deleted, all their clothing items are automatically removed (`CASCADE`).
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
import { ClothingItemTag } from '../clothing-item-tag/clothing-item-tag.entity';
import { TagSummary } from './clothing-item.types';

@Entity('clothing_items')
@ObjectType()
export class ClothingItem {
  /**
   * 🔑 Primary key: Unique identifier for each clothing item.
   * Auto-incremented integer.
   * @example 1
   */
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  item_id: number;

  /**
   * 🏷️ Name of the clothing item.
   * @example "Blue Denim Jacket"
   */
  @Column()
  @Field()
  name: string;

  /**
   * 👕 Category or type of the clothing item.
   * Used for filtering and classification.
   * @example "Jackets"
   */
  @Column()
  @Field()
  category: string;

  /**
   * 🎨 Color of the clothing item.
   * Optional field.
   * @example "Blue"
   */
  @Column({ nullable: true })
  @Field({ nullable: true })
  color: string;

  /**
   * 🖼️ URL to the stored image of the clothing item.
   * Optional field for frontend display.
   * @example "https://example.com/images/jacket.jpg"
   */
  @Column({ nullable: true })
  @Field({ nullable: true })
  image_url: string;

  /**
   * 👤 Relationship: Many clothing items belong to one user.
   * Deleting a user will cascade delete all related clothing items.
   */
  @ManyToOne(() => User, (user) => user.clothing_items, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /**
   * Numeric reference to the user who owns this item.
   * Defined by the above `ManyToOne` relationship.
   */
  @RelationId((item: ClothingItem) => item.user)
  @Field(() => Int)
  user_id: number;

  /**
   * 🔖 Relationship: One clothing item can have multiple tag associations.
   * Each link is represented by a `ClothingItemTag` entry.
   */
  @OneToMany(() => ClothingItemTag, (cit) => cit.clothing_item, {
    cascade: true,
  })
  clothing_item_tags: ClothingItemTag[];

  /**
   * 👗 Relationship: One clothing item can appear in multiple outfits.
   * Each connection is managed via the `OutfitItem` entity.
   */
  @OneToMany(() => OutfitItem, (oi) => oi.item)
  outfit_items: OutfitItem[];

  /**
   * 📅 Timestamp of when the clothing item was first uploaded.
   * Automatically set on insert.
   */
  @CreateDateColumn({ name: 'uploaded_at' })
  @Field()
  uploaded_at: Date;

  /**
   * 🕒 Timestamp of the last update made to the clothing item.
   * Automatically updated on modification.
   */
  @UpdateDateColumn({ name: 'updated_at' })
  @Field()
  updated_at: Date;

  @Field(() => [TagSummary], { nullable: true })
  tags?: TagSummary[];
}
