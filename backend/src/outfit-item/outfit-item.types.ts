import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BasicUserSummary } from '../clothing-item/clothing-item.types';
import { MessagePayload } from '../user/user.types';
import { Outfit } from '../outfit/outfit.entity';
import { ClothingItem } from '../clothing-item/clothing-item.entity';

@ObjectType()
export class OutfitItemPayload {
  @Field(() => Int)
  outfit_item_id: number;

  @Field(() => Int)
  outfit_id: number;

  @Field(() => Int)
  item_id: number;

  @Field(() => Int, { nullable: true })
  x_position?: number | null;

  @Field(() => Int, { nullable: true })
  y_position?: number | null;

  @Field(() => Int, { nullable: true })
  z_index?: number | null;

  @Field(() => String, { nullable: true })
  transform?: string | null;

  @Field(() => Outfit, { nullable: true })
  outfit?: Outfit;

  @Field(() => ClothingItem, { nullable: true })
  item?: ClothingItem;
}

@ObjectType()
export class OutfitItemWithMessage extends MessagePayload {
  @Field(() => OutfitItemPayload)
  outfit_item: OutfitItemPayload;
}
