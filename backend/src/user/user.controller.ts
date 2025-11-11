/**
 * Controller: UserController
 *
 * Handles all user-related operations including registration, authentication,
 * password reset, and profile management.
 * 
 * Exposes REST endpoints for account creation, login, password recovery,
 * user retrieval, updates, and deletion.
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  // -------------------- AUTHENTICATION --------------------

  /**
   * Registers a new user account.
   * 
   * @param dto Object containing username, email, and password.
   * @returns Confirmation message and created user record.
   */
  @Post('register')
  @ApiBody({ type: CreateUserDto })
  register(@Body() dto: CreateUserDto) {
    return this.service.register(dto);
  }

  /**
   * Authenticates an existing user using email and password.
   * 
   * @param dto Object containing login credentials.
   * @returns Authentication token and user details.
   */
  @Post('login')
  @ApiBody({ type: LoginDto })
  login(@Body() dto: LoginDto) {
    return this.service.login(dto.email, dto.password);
  }

  // -------------------- PASSWORD MANAGEMENT --------------------

  /**
   * Initiates a password reset request for a user by email.
   * 
   * @param dto Object containing user's email address.
   * @returns Reset token and confirmation of email dispatch.
   */
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.service.requestPasswordReset(dto.email);
  }

  /**
   * Resets the user's password using a valid token and verification code.
   * 
   * @param dto Object containing token, verification code, and new password.
   * @returns Success message after password reset completion.
   */
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.service.resetPassword(dto.token, dto.code, dto.password);
  }

  // -------------------- USER MANAGEMENT --------------------

  /**
   * Retrieves a list of all registered users.
   * 
   * @returns Array of user records.
   */
  @Get()
  getAll() {
    return this.service.getAllUsers();
  }

  /**
   * Retrieves details of a single user by ID.
   * 
   * @param id Numeric ID of the user.
   * @returns User record with profile information.
   */
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.getUserById(id);
  }

  /**
   * Updates the profile information of a specific user.
   * 
   * @param id User ID to update.
   * @param dto Partial user data (username, email, password, or profile image).
   * @returns Updated user record.
   */
  @Put(':id')
  @ApiBody({ type: UpdateUserDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.service.updateProfile(id, dto);
  }

  /**
   * Deletes a user account permanently.
   * 
   * @param id Numeric ID of the user.
   * @returns Confirmation message upon successful deletion.
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteUser(id);
  }
}
