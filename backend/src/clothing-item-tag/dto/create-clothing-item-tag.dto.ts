import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateClothingItemTagInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  item_id: number;

  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  tag_id: number;
}
