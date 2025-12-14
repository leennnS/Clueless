import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { StylistService } from './stylist.service';
import { StylistInput, StylistResponse } from './stylist.types';

@Resolver()
export class StylistResolver {
  constructor(private readonly stylistService: StylistService) {}

  @Mutation(() => StylistResponse)
  askStylist(@Args('input') input: StylistInput): Promise<StylistResponse> {
    return this.stylistService.askStylist(input.userId, input.message);
  }
}
