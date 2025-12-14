import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { ClothingItemTag } from '../clothing-item-tag/clothing-item-tag.entity';
import { Outfit } from '../outfit/outfit.entity';
import { OutfitItem } from '../outfit-item/outfit-item.entity';
import { Comment } from '../comments/comment.entity';
import { Like } from '../like/like.entity';

@Index(['name', 'user'], { unique: true })
@Entity('tags')
@ObjectType()
export class Tag {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  tag_id: number;

  @Column()
  @Field()
  name: string;

  @ManyToOne(() => User, (user) => user.tags, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Field(() => User, { nullable: true })
  user?: User;

  @OneToMany(() => ClothingItemTag, (clothingItemTag) => clothingItemTag.tag)
  clothing_item_tags: ClothingItemTag[];

  @OneToMany(() => OutfitItem, (outfitItem) => outfitItem.item)
  outfit_items: OutfitItem[];

  @OneToMany(() => Outfit, (outfit) => outfit.outfit_items)
  outfits: Outfit[];

  @OneToMany(() => Comment, (comment) => comment.outfit)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.outfit)
  likes: Like[];

  @CreateDateColumn()
  @Field()
  created_at: Date;

  @UpdateDateColumn()
  @Field()
  updated_at: Date;
}
