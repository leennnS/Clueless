import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OutfitItemService } from './outfit-item.service';
import { OutfitItemPayload } from './outfit-item.types';
import { CreateOutfitItemInput } from './dto/create-outfit-item.dto';
import { UpdateOutfitItemInput } from './dto/update-outfit-item.dto';
import { MessagePayload } from '../user/user.types';

@Resolver(() => OutfitItemPayload)
export class OutfitItemResolver {
  constructor(private readonly outfitItemService: OutfitItemService) {}

  @Query(() => [OutfitItemPayload], { name: 'outfitItems' })
  findAll(): Promise<OutfitItemPayload[]> {
    return this.outfitItemService.getAll();
  }

  @Query(() => OutfitItemPayload, { name: 'outfitItem' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<OutfitItemPayload> {
    return this.outfitItemService.getById(id);
  }

  @Query(() => [OutfitItemPayload], { name: 'outfitItemsByOutfit' })
  findByOutfit(
    @Args('outfitId', { type: () => Int }) outfitId: number,
  ): Promise<OutfitItemPayload[]> {
    return this.outfitItemService.getByOutfit(outfitId);
  }

  @Mutation(() => OutfitItemPayload)
  createOutfitItem(
    @Args('createOutfitItemInput') createOutfitItemInput: CreateOutfitItemInput,
  ): Promise<OutfitItemPayload> {
    return this.outfitItemService.create(createOutfitItemInput).then((res) => res.outfit_item);
  }

  @Mutation(() => OutfitItemPayload)
  updateOutfitItem(
    @Args('updateOutfitItemInput') updateOutfitItemInput: UpdateOutfitItemInput,
  ): Promise<OutfitItemPayload> {
    return this.outfitItemService
      .update(updateOutfitItemInput.outfit_item_id, updateOutfitItemInput)
      .then((res) => res.outfit_item);
  }

  @Mutation(() => MessagePayload)
  deleteOutfitItem(@Args('id', { type: () => Int }) id: number): Promise<MessagePayload> {
    return this.outfitItemService.delete(id);
  }
}
