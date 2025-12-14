import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OutfitService } from './outfit.service';
import { OutfitPayload } from './outfit.types';
import { CreateOutfitInput } from './dto/create-outfit.dto';
import { UpdateOutfitInput } from './dto/update-outfit.dto';
import { MessagePayload } from '../user/user.types';

@Resolver(() => OutfitPayload)
export class OutfitResolver {
  constructor(private readonly outfitService: OutfitService) {}

  @Query(() => [OutfitPayload], { name: 'outfits' })
  findAll(): Promise<OutfitPayload[]> {
    return this.outfitService.getAll();
  }

  @Query(() => OutfitPayload, { name: 'outfit' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<OutfitPayload> {
    return this.outfitService.getById(id);
  }

  @Query(() => [OutfitPayload], { name: 'outfitsByUser' })
  findByUser(@Args('userId', { type: () => Int }) userId: number): Promise<OutfitPayload[]> {
    return this.outfitService.getByUser(userId);
  }

  @Query(() => [OutfitPayload], { name: 'publicOutfitFeed' })
  publicFeed(
    @Args('search', { type: () => String, nullable: true }) search?: string,
    @Args('viewerId', { type: () => Int, nullable: true }) viewerId?: number,
  ): Promise<OutfitPayload[]> {
    return this.outfitService.getPublicFeed(search, viewerId);
  }

  @Mutation(() => OutfitPayload)
  createOutfit(
    @Args('createOutfitInput') createOutfitInput: CreateOutfitInput,
  ): Promise<OutfitPayload> {
    return this.outfitService.create(createOutfitInput).then((res) => res.outfit);
  }

  @Mutation(() => OutfitPayload)
  updateOutfit(
    @Args('updateOutfitInput') updateOutfitInput: UpdateOutfitInput,
  ): Promise<OutfitPayload> {
    return this.outfitService.update(updateOutfitInput.outfit_id, updateOutfitInput).then((res) => res.outfit);
  }

  @Mutation(() => MessagePayload)
  deleteOutfit(@Args('id', { type: () => Int }) id: number): Promise<MessagePayload> {
    return this.outfitService.delete(id);
  }
}
