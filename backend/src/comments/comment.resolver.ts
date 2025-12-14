import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { CreateCommentInput } from './dto/create-comment.dto';
import { UpdateCommentInput } from './dto/update-comment.dto';
import { MessagePayload } from '../user/user.types';

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @Query(() => [Comment], { name: 'commentsByOutfit' })
  commentsByOutfit(@Args('outfitId', { type: () => Int }) outfitId: number): Promise<Comment[]> {
    return this.commentService.findAllByOutfit(outfitId);
  }

  @Query(() => Comment, { name: 'comment' })
  comment(@Args('id', { type: () => Int }) id: number): Promise<Comment> {
    return this.commentService.findOne(id);
  }

  @Mutation(() => Comment)
  createComment(@Args('createCommentInput') createCommentInput: CreateCommentInput): Promise<Comment> {
    return this.commentService.create(createCommentInput);
  }

  @Mutation(() => Comment)
  updateComment(@Args('updateCommentInput') updateCommentInput: UpdateCommentInput): Promise<Comment> {
    return this.commentService.update(updateCommentInput.comment_id, updateCommentInput);
  }

  @Mutation(() => MessagePayload)
  deleteComment(@Args('id', { type: () => Int }) id: number): Promise<MessagePayload> {
    return this.commentService.delete(id);
  }
}
