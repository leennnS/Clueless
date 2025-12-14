import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Outfit } from '../outfit/outfit.entity';

@Entity('likes')
@ObjectType()
export class Like {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  like_id: number;

  @ManyToOne(() => User, (user) => user.likes, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  @Field(() => User)
  user: User;

  @RelationId((like: Like) => like.user)
  @Field(() => Int)
  user_id: number;

  @ManyToOne(() => Outfit, (outfit) => outfit.likes, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'outfit_id' })
  @Field(() => Outfit)
  outfit: Outfit;

  @RelationId((like: Like) => like.outfit)
  @Field(() => Int)
  outfit_id: number;

  @CreateDateColumn({ name: 'created_at' })
  @Field()
  created_at: Date;
}
