/**
 * ❤️ Entity: Like
 *
 * Represents a "like" interaction between a user and an outfit.
 * Each record indicates that a specific user has liked a specific outfit.
 *
 * 🔹 Table Name: `likes`
 *
 * 🔹 Purpose:
 * - Store relationships between users and outfits in a many-to-one mapping.
 * - Track who liked which outfit and when the like occurred.
 *
 * 🔹 Relationships:
 * - Many-to-One → `User` (each like belongs to one user)
 * - Many-to-One → `Outfit` (each like belongs to one outfit)
 *
 * 🔹 Cascade Behavior:
 * - If a user or outfit is deleted, all their associated likes are automatically removed.
 *
 * 🔹 Columns Summary:
 * | Column        | Type        | Description                                  |
 * |----------------|-------------|----------------------------------------------|
 * | like_id        | integer (PK)| Unique identifier for each like record.      |
 * | user_id (FK)   | integer     | References the user who liked the outfit.    |
 * | outfit_id (FK) | integer     | References the outfit that was liked.        |
 * | created_at     | timestamp   | When the like was created.                   |
 *
 * 🔹 Preconditions:
 * - Both `User` and `Outfit` must exist before a like is created.
 *
 * 🔹 Postconditions:
 * - A like record is stored and linked to the corresponding user and outfit.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  RelationId,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Outfit } from '../outfit/outfit.entity';

@Entity('likes')
export class Like {
  /**
   * 🔑 Primary Key — unique identifier for each like record.
   * Auto-incremented numeric ID.
   * @example 101
   */
  @PrimaryGeneratedColumn()
  like_id: number;

  // ---- RELATIONS ----

  /**
   * 🧍 Many-to-One relationship — the user who performed the like.
   * If the user is deleted, their likes are automatically removed.
   */
  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /**
   * 🔗 Foreign key referencing the user who liked the outfit.
   * Automatically synchronized with the `user` relation.
   */
  @RelationId((like: Like) => like.user)
  user_id: number;

  /**
   * 👗 Many-to-One relationship — the outfit that was liked.
   * If the outfit is deleted, its likes are automatically removed.
   */
  @ManyToOne(() => Outfit, (outfit) => outfit.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'outfit_id' })
  outfit: Outfit;

  /**
   * 🔗 Foreign key referencing the liked outfit.
   * Automatically synchronized with the `outfit` relation.
   */
  @RelationId((like: Like) => like.outfit)
  outfit_id: number;

  /**
   * 🕒 Timestamp indicating when the like was created.
   * Automatically generated upon insertion.
   * @example "2025-11-10T14:22:35.123Z"
   */
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
