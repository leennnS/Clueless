import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClothingItemService } from './clothing-item.service';
import { ClothingItemPayload } from './clothing-item.types';
import { MessagePayload } from '../user/user.types';
import { CreateClothingItemInput } from './dto/create-clothing-item.dto';
import { UpdateClothingItemInput } from './dto/update-clothing-item.dto';

@Resolver(() => ClothingItemPayload)
export class ClothingItemResolver {
  constructor(private readonly clothingItemService: ClothingItemService) {}

  @Query(() => [ClothingItemPayload], { name: 'clothingItems' })
  findAll(): Promise<ClothingItemPayload[]> {
    return this.clothingItemService.getAll();
  }

  @Query(() => ClothingItemPayload, { name: 'clothingItem' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<ClothingItemPayload> {
    return this.clothingItemService.getById(id);
  }

  @Query(() => [ClothingItemPayload], { name: 'clothingItemsByUser' })
  findByUser(@Args('userId', { type: () => Int }) userId: number): Promise<ClothingItemPayload[]> {
    return this.clothingItemService.getByUser(userId);
  }

  @Mutation(() => ClothingItemPayload)
  createClothingItem(
    @Args('createClothingItemInput') createClothingItemInput: CreateClothingItemInput,
  ): Promise<ClothingItemPayload> {
    return this.clothingItemService
      .create(createClothingItemInput)
      .then((res) => res.item);
  }

  @Mutation(() => ClothingItemPayload)
  updateClothingItem(
    @Args('updateClothingItemInput') updateClothingItemInput: UpdateClothingItemInput,
  ): Promise<ClothingItemPayload> {
    return this.clothingItemService
      .update(updateClothingItemInput.item_id, updateClothingItemInput)
      .then((res) => res.item);
  }

  @Mutation(() => MessagePayload)
  deleteClothingItem(@Args('id', { type: () => Int }) id: number): Promise<MessagePayload> {
    return this.clothingItemService.delete(id);
  }
}
