/**
 * 📘 GraphQL Input: CreateClothingItemInput
 *
 * Represents the data structure required to create a new clothing item
 * within the wardrobe system. This DTO ensures that incoming requests
 * from the client contain all necessary fields with proper validation
 * before reaching the service or database layers.
 *
 * 🔹 Used In:
 * - ClothingItemController → `POST /clothing-items`
 * - ClothingItemService → `create()`
 *
 * 🔹 Responsibilities:
 * - Validate request data before insertion.
 * - Provide API documentation metadata for Swagger.
 * - Enforce data integrity between frontend and backend.
 *
 * 🔹 Validation:
 * Utilizes `class-validator` decorators to ensure type safety and required fields.
 *
 * 🔹 Related Entities:
 * - ClothingItem
 * - Tag
 * - User
 */

import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateClothingItemInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  category: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  color?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  image_url?: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  tag_ids?: number[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tag_names?: string[];
}
