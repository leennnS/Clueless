/**
 * 📘 GraphQL Input: UpdateClothingItemInput
 *
 * Represents the structure used when updating an existing clothing item.
 * This DTO ensures that all modifications to clothing records are
 * validated before being applied to the database.
 *
 * 🔹 Used In:
 * - ClothingItemController → `PATCH /clothing-items/:id`
 * - ClothingItemService → `update()`
 *
 * 🔹 Responsibilities:
 * - Define which fields can be updated.
 * - Allow partial updates (all fields optional).
 * - Maintain validation and Swagger documentation consistency.
 *
 * 🔹 Validation:
 * Uses `class-validator` to ensure that only valid data types
 * (string/number) are accepted when performing updates.
 *
 * 🔹 Related Entity:
 * - ClothingItem
 */

import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateClothingItemInput } from './create-clothing-item.dto';

@InputType()
export class UpdateClothingItemInput extends PartialType(CreateClothingItemInput) {
  @Field(() => Int)
  @IsNumber()
  item_id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  color?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  image_url?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  user_id?: number;
}
