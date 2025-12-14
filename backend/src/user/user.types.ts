import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
export class MessagePayload {
  @Field()
  message: string;
}

@ObjectType()
export class AuthPayload extends MessagePayload {
  @Field({ nullable: true })
  token?: string;

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class UserPayload extends MessagePayload {
  @Field(() => User)
  user: User;
}

@ObjectType()
export class PasswordResetRequestPayload extends MessagePayload {
  @Field({ nullable: true })
  resetToken?: string;

  @Field({ nullable: true })
  resetCode?: string;

  @Field({ nullable: true })
  emailDelivery?: boolean;

  @Field({ nullable: true })
  email?: string;
}

@ObjectType()
export class WardrobePreviewItem {
  @Field(() => Int)
  item_id: number;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  category?: string | null;

  @Field(() => String, { nullable: true })
  color?: string | null;

  @Field(() => String, { nullable: true })
  image_url?: string | null;
}

@ObjectType()
export class WardrobePreviewOutfit {
  @Field(() => Int)
  outfit_id: number;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => String, { nullable: true })
  cover_image_url?: string | null;

  @Field()
  is_public: boolean;
}

@ObjectType()
export class WardrobeColorStat {
  @Field(() => String)
  color: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class WardrobeTagStat {
  @Field(() => String)
  tag: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class WardrobeItemStat {
  @Field(() => Int)
  item_id: number;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  category?: string | null;

  @Field(() => String, { nullable: true })
  color?: string | null;

  @Field(() => String, { nullable: true })
  image_url?: string | null;

  @Field(() => Int)
  wear_count: number;
}

@ObjectType()
export class WardrobeSummary {
  @Field(() => Int)
  user_id: number;

  @Field(() => Int)
  total_items: number;

  @Field(() => Int)
  total_outfits: number;

  @Field(() => [String])
  favorites: string[];

  @Field(() => [WardrobePreviewItem])
  latest_items: WardrobePreviewItem[];

  @Field(() => [WardrobePreviewOutfit])
  latest_outfits: WardrobePreviewOutfit[];

  @Field(() => [WardrobeColorStat])
  favorite_colors: WardrobeColorStat[];

  @Field(() => [WardrobeTagStat])
  top_tags: WardrobeTagStat[];

  @Field(() => WardrobeItemStat, { nullable: true })
  most_worn_item?: WardrobeItemStat | null;
}
