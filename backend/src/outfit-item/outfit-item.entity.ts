/**
 * Entity: OutfitItem
 *
 * Represents the relationship between an outfit and a specific clothing item.
 * Each record defines how a clothing item is visually placed within an outfit —
 * including its position, stacking order, and any applied transformations.
 *
 * This entity enables the outfit builder feature, allowing users to arrange
 * multiple clothing items on a virtual canvas.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Outfit } from '../outfit/outfit.entity';
import { ClothingItem } from '../clothing-item/clothing-item.entity';

@Entity('outfit_items')
export class OutfitItem {
  @PrimaryGeneratedColumn()
  outfit_item_id: number;

  // ---------------------------------------------------------------------------
  // RELATIONS
  // ---------------------------------------------------------------------------

  /**
   * The outfit this item is part of.
   *
   * Each outfit item belongs to exactly one outfit.
   * Deleting the parent outfit cascades and removes all related items.
   *
   * Example: Outfit #5 → includes several OutfitItem entries.
   */
  @ManyToOne(() => Outfit, (outfit) => outfit.outfit_items, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'outfit_id' })
  outfit: Outfit;

  /**
   * The clothing item being placed within the outfit.
   *
   * Each outfit item references one clothing item.
   * Deleting a clothing item automatically removes its links from all outfits.
   */
  @ManyToOne(() => ClothingItem, (item) => item.outfit_items, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'item_id' })
  item: ClothingItem;

  // ---------------------------------------------------------------------------
  // POSITION & LAYOUT DATA
  // ---------------------------------------------------------------------------

  /**
   * X-axis coordinate of the item’s position on the outfit canvas.
   * Represents horizontal placement.
   *
   * Optional — may be null if not explicitly positioned.
   */
  @Column({ type: 'int', nullable: true })
  x_position: number;

  /**
   * Y-axis coordinate of the item’s position on the outfit canvas.
   * Represents vertical placement.
   *
   * Optional — may be null if not explicitly positioned.
   */
  @Column({ type: 'int', nullable: true })
  y_position: number;

  /**
   * Layer index determining visual stacking order.
   * Higher z-index values render above lower ones.
   *
   * Optional — defaults to natural stacking order if undefined.
   */
  @Column({ type: 'int', nullable: true })
  z_index: number;

  /**
   * JSON field storing transformation metadata.
   * Includes optional properties such as scale, rotation, or skew values.
   *
   * Example:
   * {
   *   "scale": 1.1,
   *   "rotation": 15
   * }
   */
  @Column({ type: 'jsonb', nullable: true })
  transform: Record<string, any>;
}

/**
 * Preconditions:
 * - Both `outfit` and `item` must exist in their respective tables.
 * - Position and transform fields are optional but must follow valid types.
 *
 * Postconditions:
 * - A record links one clothing item to a specific outfit layout,
 *   defining its visual appearance on the canvas.
 */
