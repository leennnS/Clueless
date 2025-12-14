import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

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
import { AuthModule } from './auth/auth.module';
import { WeatherModule } from './weather/weather.module';
import { StylistModule } from './stylist/stylist.module';

const requiredEnv = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const parseNumberEnv = (name: string) => {
  const raw = requiredEnv(name);
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid number.`);
  }
  return parsed;
};

const nodeEnv = process.env.NODE_ENV ?? 'development';
const synchronize = nodeEnv === 'production' ? false : true;

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      path: '/graphql',
      context: ({ req }) => ({ req }),
    }),

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
      host: requiredEnv('DB_HOST'),
      port: parseNumberEnv('DB_PORT'),
      username: requiredEnv('DB_USERNAME'),
      password: requiredEnv('DB_PASSWORD'),
      database: requiredEnv('DB_NAME'),
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
      synchronize,
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
    AuthModule,
    WeatherModule,
    StylistModule,
  ],
})
export class AppModule {}
