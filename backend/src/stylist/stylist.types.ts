import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export type StylistSender = 'user' | 'assistant';

@ObjectType()
export class StylistItemSuggestion {
  @Field(() => Int)
  itemId: number;

  @Field(() => String, { nullable: true })
  reason?: string | null;
}

@ObjectType()
export class StylistOutfitSuggestion {
  @Field()
  name: string;

  @Field(() => [StylistItemSuggestion])
  items: StylistItemSuggestion[];

  @Field()
  reasoning: string;
}

@ObjectType()
export class ShoppingSuggestion {
  @Field()
  category: string;

  @Field()
  reason: string;
}

@ObjectType()
export class StylistMessage {
  @Field()
  sender: string;

  @Field()
  text: string;
}

@ObjectType()
export class StylistResponse {
  @Field(() => [StylistMessage])
  messages: StylistMessage[];

  @Field(() => [StylistOutfitSuggestion])
  outfits: StylistOutfitSuggestion[];

  @Field(() => [ShoppingSuggestion])
  shoppingSuggestions: ShoppingSuggestion[];
}

@InputType()
export class StylistInput {
  @Field(() => Int)
  @IsInt()
  userId: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  message: string;
}
