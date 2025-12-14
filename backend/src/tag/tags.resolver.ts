import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TagsService } from './tags.service';
import { Tag } from './tag.entity';
import { CreateTagInput } from './dto/create-tag.dto';
import { UpdateTagInput } from './dto/update-tag.dto';
import { MessagePayload } from '../user/user.types';

@Resolver(() => Tag)
export class TagsResolver {
  constructor(private readonly tagsService: TagsService) {}

  @Query(() => [Tag], { name: 'tags' })
  findAll(): Promise<Tag[]> {
    return this.tagsService.findAll();
  }

  @Query(() => Tag, { name: 'tag' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Tag> {
    return this.tagsService.findOne(id);
  }

  @Mutation(() => Tag)
  createTag(@Args('createTagInput') createTagInput: CreateTagInput): Promise<Tag> {
    return this.tagsService.create(createTagInput).then((res) => res.tag);
  }

  @Mutation(() => Tag)
  updateTag(@Args('updateTagInput') updateTagInput: UpdateTagInput): Promise<Tag> {
    return this.tagsService.update(updateTagInput.tag_id, updateTagInput).then((res) => res.tag);
  }

  @Mutation(() => MessagePayload)
  deleteTag(@Args('id', { type: () => Int }) id: number): Promise<MessagePayload> {
    return this.tagsService.delete(id);
  }
}
