import { Field, InputType, PartialType, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CreateTagInput } from './create-tag.dto';

@InputType()
export class UpdateTagInput extends PartialType(CreateTagInput) {
  @Field(() => Int)
  @IsInt()
  tag_id: number;
}
