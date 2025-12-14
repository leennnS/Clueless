import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LikesService } from './like.service';
import { Like } from './like.entity';
import { CreateLikeInput } from './dto/create-like.input';
import { MessagePayload } from '../user/user.types';

@Resolver(() => Like)
export class LikeResolver {
  constructor(private readonly likesService: LikesService) {}

  @Query(() => [Like], { name: 'likes' })
  findAll(): Promise<Like[]> {
    return this.likesService.getAll();
  }

  @Query(() => Like, { name: 'like' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Like> {
    return this.likesService.getById(id);
  }

  @Query(() => [Like], { name: 'likesByUser' })
  findByUser(@Args('userId', { type: () => Int }) userId: number): Promise<Like[]> {
    return this.likesService.getByUser(userId);
  }

  @Query(() => [Like], { name: 'likesForCreator' })
  findForCreator(@Args('creatorId', { type: () => Int }) creatorId: number): Promise<Like[]> {
    return this.likesService.getForCreator(creatorId);
  }

  @Mutation(() => Like)
  likeOutfit(@Args('createLikeInput') createLikeInput: CreateLikeInput): Promise<Like> {
    return this.likesService
      .create(createLikeInput.user_id, createLikeInput.outfit_id)
      .then((res) => res.like as Like);
  }

  @Mutation(() => Like, { nullable: true })
  toggleLike(@Args('createLikeInput') createLikeInput: CreateLikeInput): Promise<Like | null> {
    return this.likesService.toggle(createLikeInput.user_id, createLikeInput.outfit_id).then((res) => res.like ?? null);
  }

  @Mutation(() => MessagePayload)
  deleteLike(@Args('id', { type: () => Int }) id: number): Promise<MessagePayload> {
    return this.likesService.delete(id);
  }
}
