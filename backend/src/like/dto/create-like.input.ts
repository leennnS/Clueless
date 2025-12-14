import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class CreateLikeInput {
  @Field(() => Int)
  @IsInt()
  user_id: number;

  @Field(() => Int)
  @IsInt()
  outfit_id: number;
}
