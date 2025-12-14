import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TagSummary {
  @Field(() => Int)
  tag_id: number;

  @Field(() => String)
  name: string;
}

@ObjectType()
export class BasicUserSummary {
  @Field(() => Int)
  user_id: number;

  @Field(() => String, { nullable: true })
  username?: string | null;

  @Field(() => String, { nullable: true })
  email?: string | null;

  @Field(() => String, { nullable: true })
  profile_image_url?: string | null;
}

@ObjectType()
export class ClothingItemPayload {
  @Field(() => Int)
  item_id: number;

  @Field(() => Int)
  user_id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  category: string;

  @Field(() => String, { nullable: true })
  color?: string | null;

  @Field(() => String, { nullable: true })
  image_url?: string | null;

  @Field()
  uploaded_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => BasicUserSummary, { nullable: true })
  user?: BasicUserSummary;

  @Field(() => [TagSummary])
  tags: TagSummary[];
}
