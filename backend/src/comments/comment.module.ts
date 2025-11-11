/**
 * 💬 Module: CommentModule
 *
 * Integrates all components related to the comment feature.
 * This module handles database operations, business logic, and REST API routes
 * for managing comments associated with outfits and users.
 *
 * 🔹 Purpose:
 * - Encapsulates all comment-related functionality in a single module.
 * - Registers entities (`Comment`, `User`, `Outfit`) for dependency injection.
 * - Connects the `CommentService` (logic) and `CommentController` (routes).
 *
 * 🔹 Responsibilities:
 * - Enable CRUD operations for user comments.
 * - Maintain relationships between comments, users, and outfits.
 *
 * 🔹 Imports:
 * - `TypeOrmModule.forFeature([Comment, User, Outfit])`
 *   → Makes repositories for these entities available to the service.
 *
 * 🔹 Providers:
 * - `CommentService` → Contains the business logic for handling comment creation,
 *   retrieval, updating, and deletion.
 *
 * 🔹 Controllers:
 * - `CommentController` → Defines the API endpoints under `/comments`.
 *
 * 🔹 Related Files:
 * - `comment.entity.ts` → Database schema and relationships.
 * - `comment.service.ts` → Business logic.
 * - `comment.controller.ts` → REST interface.
 * - `create-comment.dto.ts`, `update-comment.dto.ts` → Data validation.
 *
 * 🔹 Preconditions:
 * - Users and outfits must exist before comments can be created.
 *
 * 🔹 Postconditions:
 * - Comments are persisted, retrievable, and synchronized with related entities.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { User } from '../user/user.entity';
import { Outfit } from '../outfit/outfit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Outfit])],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
