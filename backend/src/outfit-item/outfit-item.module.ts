/**
 * Module: OutfitItemModule
 *
 * Provides all dependencies required for managing outfit–item relationships.
 * This module encapsulates the entity, service, and controller responsible for
 * linking clothing items to outfits and defining their visual layout on the canvas.
 *
 * It integrates with TypeORM to handle persistence and is exported for use by
 * other modules (e.g., OutfitModule or UserModule) that require outfit-item data.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutfitItem } from './outfit-item.entity';
import { OutfitItemService } from './outfit-item.service';
import { OutfitItemController } from './outfit-item.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OutfitItem])],
  controllers: [OutfitItemController],
  providers: [OutfitItemService],
  exports: [OutfitItemService],
})
export class OutfitItemModule {}
