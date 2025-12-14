import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutfitItem } from './outfit-item.entity';
import { OutfitItemService } from './outfit-item.service';
import { OutfitItemResolver } from './outfit-item.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([OutfitItem])],
  providers: [OutfitItemService, OutfitItemResolver],
  exports: [OutfitItemService],
})
export class OutfitItemModule {}
