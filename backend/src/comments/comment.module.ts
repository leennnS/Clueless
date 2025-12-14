import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { User } from '../user/user.entity';
import { Outfit } from '../outfit/outfit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Outfit])],
  providers: [CommentService, CommentResolver],
  exports: [CommentService],
})
export class CommentModule {}
