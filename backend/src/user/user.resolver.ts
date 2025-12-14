import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UpdateUserInput } from './dto/update-user.dto';
import { MessagePayload, UserPayload, WardrobeSummary } from './user.types';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  findAll(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Query(() => WardrobeSummary, { name: 'wardrobeSummary' })
  wardrobeSummary(@Args('userId', { type: () => Int }) userId: number): Promise<WardrobeSummary> {
    return this.userService.getWardrobeSummary(userId);
  }

  @Mutation(() => UserPayload)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput): Promise<UserPayload> {
    return this.userService.updateProfile(updateUserInput);
  }

  @Mutation(() => MessagePayload)
  deleteUser(@Args('id', { type: () => Int }) id: number): Promise<MessagePayload> {
    return this.userService.deleteUser(id);
  }

}
