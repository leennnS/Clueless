import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateOutfitItemInput } from './create-outfit-item.dto';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateOutfitItemInput extends PartialType(CreateOutfitItemInput) {
  @Field(() => Int)
  @IsInt()
  outfit_item_id: number;
}
