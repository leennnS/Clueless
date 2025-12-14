import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  RelationId,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Outfit } from '../outfit/outfit.entity';

@Entity('comments')
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  comment_id: number;

  @Column({ type: 'text', default: '' })
  @Field()
  content: string;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Field(() => User)
  user: User;

  @RelationId((comment: Comment) => comment.user)
  @Field(() => Int)
  user_id: number;

  @ManyToOne(() => Outfit, (outfit) => outfit.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'outfit_id' })
  @Field(() => Outfit)
  outfit: Outfit;

  @RelationId((comment: Comment) => comment.outfit)
  @Field(() => Int)
  outfit_id: number;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field()
  updated_at: Date;
}
