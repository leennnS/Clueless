import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClothingItem } from '../clothing-item/clothing-item.entity';
import { Outfit } from '../outfit/outfit.entity';
import { ScheduledOutfit } from '../scheduled-outfit/scheduled-outfit.entity';
import { Comment } from '../comments/comment.entity';
import { Tag } from '../tag/tag.entity';
import { Like } from '../like/like.entity';
import { PasswordResetToken } from './password-reset-token.entity';

@Entity('users')
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  user_id: number;

  @Column({ unique: true })
  @Field(() => String)
  username: string;

  @Column({ unique: true })
  @Field(() => String)
  email: string;

  @Column({ nullable: true })
  password_hash?: string;

  @Column({ name: 'profile_image_url', type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  profile_image_url?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  @Field(() => Date)
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field(() => Date)
  updated_at: Date;

  @OneToMany(() => ClothingItem, (item) => item.user, {
    cascade: true,
  })
  @Field(() => [ClothingItem], { nullable: true })
  clothing_items: ClothingItem[];

  @OneToMany(() => Outfit, (outfit) => outfit.user)
  @Field(() => [Outfit], { nullable: true })
  outfits: Outfit[];

  @OneToMany(() => ScheduledOutfit, (scheduled) => scheduled.user)
  @Field(() => [ScheduledOutfit], { nullable: true })
  scheduled_outfits: ScheduledOutfit[];

  @OneToMany(() => Comment, (comment) => comment.user)
  @Field(() => [Comment], { nullable: true })
  comments: Comment[];

  @OneToMany(() => Tag, (tag) => tag.user, { cascade: true })
  @Field(() => [Tag], { nullable: true })
  tags: Tag[];

  @OneToMany(() => Like, (like) => like.user)
  @Field(() => [Like], { nullable: true })
  likes: Like[];

  @OneToMany(
    () => PasswordResetToken,
    (passwordResetToken) => passwordResetToken.user,
  )
  password_reset_tokens: PasswordResetToken[];
}
