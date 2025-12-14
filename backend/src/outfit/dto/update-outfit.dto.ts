import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateOutfitInput } from './create-outfit.dto';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateOutfitInput extends PartialType(CreateOutfitInput) {
  @Field(() => Int)
  @IsInt()
  outfit_id: number;
}
