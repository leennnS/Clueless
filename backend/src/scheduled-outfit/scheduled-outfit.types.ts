import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BasicUserSummary } from '../clothing-item/clothing-item.types';
import { MessagePayload } from '../user/user.types';
import { Outfit } from '../outfit/outfit.entity';

@ObjectType()
export class ScheduledOutfitPayload {
  @Field(() => Int)
  schedule_id: number;

  @Field(() => Int)
  user_id: number;

  @Field(() => Int)
  outfit_id: number;

  @Field()
  schedule_date: Date;

  @Field()
  created_at: Date;

  @Field(() => BasicUserSummary, { nullable: true })
  user?: BasicUserSummary;

  @Field(() => Outfit, { nullable: true })
  outfit?: Outfit;
}

@ObjectType()
export class ScheduledOutfitWithMessage extends MessagePayload {
  @Field(() => ScheduledOutfitPayload)
  scheduled_outfit: ScheduledOutfitPayload;
}
