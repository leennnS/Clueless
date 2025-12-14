import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BasicUserSummary } from '../clothing-item/clothing-item.types';
import { MessagePayload } from '../user/user.types';
import { Outfit } from './outfit.entity';

@ObjectType()
export class OutfitPayload {
  @Field(() => Int)
  outfit_id: number;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => Boolean)
  is_public: boolean;

  @Field(() => String, { nullable: true })
  cover_image_url?: string | null;

  @Field(() => Int)
  user_id: number;

  @Field(() => BasicUserSummary, { nullable: true })
  user?: BasicUserSummary;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;

  @Field(() => Int, { nullable: true })
  like_count?: number;

  @Field(() => Int, { nullable: true })
  comment_count?: number;

  @Field(() => Boolean, { nullable: true })
  liked_by_viewer?: boolean;
}

@ObjectType()
export class OutfitWithMessage extends MessagePayload {
  @Field(() => Outfit)
  outfit: Outfit;
}
