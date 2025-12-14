import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsDateString, IsInt, IsOptional } from 'class-validator';
import { CreateScheduledOutfitInput } from './create-scheduled-outfit.dto';
import { Type } from 'class-transformer';

@InputType()
export class UpdateScheduledOutfitInput extends PartialType(CreateScheduledOutfitInput) {
  @Field(() => Int)
  @Type(() => Number)
  @IsInt()
  schedule_id: number;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  schedule_date?: string;
}
