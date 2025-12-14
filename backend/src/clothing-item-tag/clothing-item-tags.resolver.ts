import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ClothingItemTagsService } from './clothing-item-tags.service';
import { CreateClothingItemTagInput } from './dto/create-clothing-item-tag.dto';
import { ClothingItemTag } from './clothing-item-tag.entity';
import { MessagePayload } from '../user/user.types';

@Resolver(() => ClothingItemTag)
export class ClothingItemTagResolver {
  constructor(private readonly clothingItemTagsService: ClothingItemTagsService) {}

  @Query(() => [ClothingItemTag], { name: 'clothingItemTags' })
  findAll(): Promise<ClothingItemTag[]> {
    return this.clothingItemTagsService.findAll();
  }

  @Query(() => ClothingItemTag, { name: 'clothingItemTag' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<ClothingItemTag> {
    return this.clothingItemTagsService.findOne(id);
  }

  @Mutation(() => ClothingItemTag)
  createClothingItemTag(
    @Args('createClothingItemTagInput') createClothingItemTagInput: CreateClothingItemTagInput,
  ): Promise<ClothingItemTag> {
    return this.clothingItemTagsService.create(createClothingItemTagInput);
  }

  @Mutation(() => MessagePayload)
  removeClothingItemTag(@Args('id', { type: () => Int }) id: number): Promise<MessagePayload> {
    return this.clothingItemTagsService.remove(id);
  }
}
