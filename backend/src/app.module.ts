/**
 * Module: AppModule
 *
 * The root application module that wires together all feature modules,
 * database entities, and static asset configuration for the Virtual Closet project.
 *
 * Responsibilities:
 *  - Registers global configuration for TypeORM (PostgreSQL).
 *  - Serves uploaded images statically from the `/public/images` directory.
 *  - Imports all feature modules (Users, Outfits, Tags, Comments, Likes, etc.)
 *    to make their controllers and services available throughout the app.
 *
 * @note `synchronize: true` is enabled for development and should be disabled in production.
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// --- Entities ---
import { User } from './user/user.entity';
import { ClothingItem } from './clothing-item/clothing-item.entity';
import { Outfit } from './outfit/outfit.entity';
import { OutfitItem } from './outfit-item/outfit-item.entity';
import { ScheduledOutfit } from './scheduled-outfit/scheduled-outfit.entity';
import { Comment } from './comments/comment.entity';
import { Tag } from './tag/tag.entity';
import { ClothingItemTag } from './clothing-item-tag/clothing-item-tag.entity';
import { Like } from './like/like.entity';
import { PasswordResetToken } from './user/password-reset-token.entity';

// --- Modules ---
import { UserModule } from './user/user.module';
import { ClothingItemModule } from './clothing-item/clothing-item.module';
import { OutfitModule } from './outfit/outfit.module';
import { OutfitItemModule } from './outfit-item/outfit-item.module';
import { ScheduledOutfitModule } from './scheduled-outfit/scheduled-outfit.module';
import { CommentModule } from './comments/comment.module';
import { TagsModule } from './tag/tags.module';
import { ClothingItemTagsModule } from './clothing-item-tag/clothing-item-tags.module';
import { LikesModule } from './like/like.module';

@Module({
  imports: [
    /**
     * Serves static image assets from the /public/images directory.
     * This allows frontend clients to load uploaded images via /images URLs.
     */
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'images'),
      serveRoot: '/images',
    }),

    /**
     * Database configuration for PostgreSQL.
     * Registers all project entities for schema synchronization and repository injection.
     */
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'virtual_closet_clueless',
      entities: [
        User,
        ClothingItem,
        Outfit,
        OutfitItem,
        ScheduledOutfit,
        Comment,
        Tag,
        ClothingItemTag,
        Like,
        PasswordResetToken,
      ],
      synchronize: true, // ⚠️ Use only in development; disables migrations.
    }),

    // --- Domain Modules ---
    UserModule,
    ClothingItemModule,
    OutfitModule,
    OutfitItemModule,
    ScheduledOutfitModule,
    CommentModule,
    TagsModule,
    ClothingItemTagsModule,
    LikesModule,
  ],
})
export class AppModule {}
