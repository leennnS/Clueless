/**
 * Controller: ScheduledOutfitController
 *
 * Exposes RESTful endpoints for managing scheduled outfits.
 * Provides create, read, update, and delete (CRUD) operations
 * for linking user outfits to specific calendar dates.
 *
 * This controller delegates business logic to the `ScheduledOutfitService`
 * and ensures that all incoming data is properly validated via DTOs.
 */
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { ScheduledOutfitService } from './scheduled-outfit.service';
import { CreateScheduledOutfitDto } from './dto/create-scheduled-outfit.dto';
import { UpdateScheduledOutfitDto } from './dto/update-scheduled-outfit.dto';

@Controller('scheduled-outfits')
export class ScheduledOutfitController {
  constructor(private readonly service: ScheduledOutfitService) {}

  // ---------------------------------------------------------------------------
  // CREATE
  // ---------------------------------------------------------------------------

  /**
   * Creates a new scheduled outfit entry.
   *
   * @param dto - Data Transfer Object containing outfit ID, user ID, and schedule date.
   * @returns The newly created scheduled outfit with linked user and outfit data.
   *
   * Preconditions:
   * - The provided `user_id` and `outfit_id` must correspond to existing records.
   * - `schedule_date` must be a valid ISO 8601 date string.
   *
   * Postconditions:
   * - A new record is persisted linking the outfit to the specified user and date.
   */
  @Post()
  async create(@Body() dto: CreateScheduledOutfitDto) {
    return this.service.create(dto);
  }

  // ---------------------------------------------------------------------------
  // GET ALL (BY USER)
  // ---------------------------------------------------------------------------

  /**
   * Retrieves all scheduled outfits for a specific user.
   *
   * @param user_id - The ID of the user whose scheduled outfits are being requested.
   * @returns A list of all outfits scheduled by the specified user.
   *
   * Postconditions:
   * - Returns an empty array if no scheduled outfits exist for the user.
   */
  @Get('user/:user_id')
  async findAllByUser(@Param('user_id', ParseIntPipe) user_id: number) {
    return this.service.findAllByUser(user_id);
  }

  // ---------------------------------------------------------------------------
  // GET BY ID
  // ---------------------------------------------------------------------------

  /**
   * Retrieves a single scheduled outfit by its unique ID.
   *
   * @param id - The unique identifier of the scheduled outfit.
   * @returns The corresponding scheduled outfit record, including linked user and outfit details.
   *
   * Postconditions:
   * - Throws `NotFoundException` if the scheduled outfit does not exist.
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  // ---------------------------------------------------------------------------
  // UPDATE
  // ---------------------------------------------------------------------------

  /**
   * Updates the schedule date of an existing scheduled outfit.
   *
   * @param id - The ID of the scheduled outfit to update.
   * @param dto - DTO containing the new schedule date.
   * @returns Confirmation message and the updated record.
   *
   * Preconditions:
   * - The specified ID must correspond to an existing record.
   * - `schedule_date` (if provided) must be in valid ISO format.
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateScheduledOutfitDto,
  ) {
    return this.service.update(id, dto);
  }

  // ---------------------------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------------------------

  /**
   * Deletes a scheduled outfit by its ID.
   *
   * @param id - The ID of the scheduled outfit to delete.
   * @returns A confirmation message upon successful deletion.
   *
   * Postconditions:
   * - The scheduled outfit is permanently removed from the database.
   */
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.service.delete(id);
    return { message: 'Scheduled outfit deleted successfully.' };
  }
}
