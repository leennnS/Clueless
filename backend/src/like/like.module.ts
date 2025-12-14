import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { LikesService } from './like.service';
import { LikeResolver } from './like.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Like])],
  providers: [LikesService, LikeResolver],
  exports: [LikesService],
})
export class LikesModule {}
