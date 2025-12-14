import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ScheduledOutfitService } from './scheduled-outfit.service';
import { ScheduledOutfitPayload } from './scheduled-outfit.types';
import { CreateScheduledOutfitInput } from './dto/create-scheduled-outfit.dto';
import { UpdateScheduledOutfitInput } from './dto/update-scheduled-outfit.dto';
import { MessagePayload } from '../user/user.types';

@Resolver(() => ScheduledOutfitPayload)
export class ScheduledOutfitResolver {
  constructor(private readonly service: ScheduledOutfitService) {}

  @Query(() => [ScheduledOutfitPayload], { name: 'scheduledOutfits' })
  findAll(): Promise<ScheduledOutfitPayload[]> {
    return this.service.findAll();
  }

  @Query(() => [ScheduledOutfitPayload], { name: 'scheduledOutfitsByUser' })
  findAllByUser(
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<ScheduledOutfitPayload[]> {
    return this.service.findAllByUser(userId);
  }

  @Query(() => ScheduledOutfitPayload, { name: 'scheduledOutfit' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<ScheduledOutfitPayload> {
    return this.service.findOne(id);
  }

  @Mutation(() => ScheduledOutfitPayload)
  createScheduledOutfit(
    @Args('createScheduledOutfitInput') createScheduledOutfitInput: CreateScheduledOutfitInput,
  ): Promise<ScheduledOutfitPayload> {
    return this.service
      .create(createScheduledOutfitInput)
      .then((res) => res.scheduled_outfit);
  }

  @Mutation(() => ScheduledOutfitPayload)
  updateScheduledOutfit(
    @Args('updateScheduledOutfitInput') updateScheduledOutfitInput: UpdateScheduledOutfitInput,
  ): Promise<ScheduledOutfitPayload> {
    return this.service
      .update(updateScheduledOutfitInput)
      .then((res) => res.scheduled_outfit);
  }

  @Mutation(() => MessagePayload)
  deleteScheduledOutfit(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<MessagePayload> {
    return this.service.delete(id);
  }
}
