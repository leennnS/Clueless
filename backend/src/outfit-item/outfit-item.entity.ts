import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Outfit } from '../outfit/outfit.entity';
import { ClothingItem } from '../clothing-item/clothing-item.entity';

@Entity('outfit_items')
@ObjectType()
export class OutfitItem {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  outfit_item_id: number;

  @ManyToOne(() => Outfit, (outfit) => outfit.outfit_items, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'outfit_id' })
  outfit: Outfit;

  @ManyToOne(() => ClothingItem, (item) => item.outfit_items, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'item_id' })
  item: ClothingItem;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  x_position: number;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  y_position: number;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  z_index: number;

  @Column({ type: 'jsonb', nullable: true })
  @Field(() => String, { nullable: true })
  transform?: Record<string, any> | null;
}
