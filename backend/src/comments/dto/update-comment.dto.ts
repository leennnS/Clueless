import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateCommentInput } from './create-comment.dto';
import { IsInt } from 'class-validator';

@InputType()
export class UpdateCommentInput extends PartialType(CreateCommentInput) {
  @Field(() => Int)
  @IsInt()
  comment_id: number;
}
