import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClothingItem } from '../clothing-item/clothing-item.entity';
import { Tag } from '../tag/tag.entity';

@Entity('clothing_item_tags')
@ObjectType()
export class ClothingItemTag {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @ManyToOne(() => ClothingItem, (clothingItem) => clothingItem.clothing_item_tags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'clothing_item_id' })
  clothing_item: ClothingItem;

  @ManyToOne(() => Tag, (tag) => tag.clothing_item_tags, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  created_at: Date;
}
