/**
 * Service: UserService
 *
 * Handles all core user operations including registration, authentication,
 * password resets, and profile management. Integrates with the database
 * through TypeORM repositories for `User` and `PasswordResetToken`.
 */
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordResetToken } from './password-reset-token.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PasswordResetToken)
    private readonly resetRepository: Repository<PasswordResetToken>,
  ) {}

  /**
   * Retrieve all registered users with their clothing items.
   * 
   * @precondition Database connection is active.
   * @postcondition Password hashes are removed before returning the response.
   * @throws {InternalServerErrorException} if retrieval fails.
   */
  async getAllUsers() {
    try {
      const users = await this.userRepository.find({
        relations: ['clothing_items'],
      });
      return users.map((user) => {
        delete user.password_hash;
        return user;
      });
    } catch {
      throw new InternalServerErrorException('Failed to fetch users.');
    }
  }

  /**
   * Retrieve a single user and their wardrobe items by ID.
   *
   * @param id - User’s unique identifier.
   * @returns The corresponding user object.
   * @throws {NotFoundException} if user does not exist.
   */
  async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { user_id: id },
      relations: ['clothing_items'],
    });
    if (!user) throw new NotFoundException('User not found.');
    delete user.password_hash;
    return user;
  }

  /**
   * Register a new user account with hashed password storage.
   *
   * @param dto - Validated registration payload.
   * @returns Newly created user data without sensitive fields.
   * @throws {ConflictException} if username or email already exists.
   * @throws {BadRequestException} if required fields are missing.
   */
  async register(dto: CreateUserDto) {
    const { username, email, password } = dto;

    if (!username || !email || !password) {
      throw new BadRequestException('Missing required fields.');
    }

    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser)
      throw new ConflictException('Username or email already exists.');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      username,
      email,
      password_hash: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    return {
      message: 'User registered successfully.',
      user: {
        id: savedUser.user_id,
        username: savedUser.username,
        email: savedUser.email,
        profile_image_url: savedUser.profile_image_url ?? null,
      },
    };
  }

  /**
   * Authenticate a user and issue a signed JWT token.
   *
   * @param email - Registered email address.
   * @param password - Plaintext password for verification.
   * @returns Authentication token and sanitized user data.
   * @throws {UnauthorizedException} if credentials are invalid.
   * @throws {InternalServerErrorException} for unexpected failures.
   */
  async login(email: string, password: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: ['user_id', 'email', 'username', 'password_hash', 'profile_image_url'],
      });

      if (!user) throw new UnauthorizedException('Invalid email or password.');

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid)
        throw new UnauthorizedException('Invalid email or password.');

      const token = jwt.sign(
        { id: user.user_id, email: user.email },
        process.env.JWT_SECRET || 'SECRET_KEY',
        { expiresIn: '1h' },
      );

      return {
        message: 'Login successful.',
        token,
        user: {
          id: user.user_id,
          username: user.username,
          email: user.email,
          profile_image_url: user.profile_image_url ?? null,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Login failed: ' + (error.message || 'Unknown error.'),
      );
    }
  }

  /**
   * Generate a password reset token and dispatch a verification code by email.
   *
   * @param email - User’s registered email address.
   * @returns Reset token metadata and (in dev) the verification code.
   * @throws {BadRequestException} if email is missing or invalid.
   */
  async requestPasswordReset(email: string) {
    if (!email) throw new BadRequestException('Email is required.');

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return {
        message:
          'If an account exists for that email, a reset code has been sent.',
        token: randomUUID(),
        emailDelivery: false,
      };
    }

    const code = this.generateResetCode();
    const codeHash = await bcrypt.hash(code, 10);
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const resetToken = this.resetRepository.create({
      user,
      token,
      code_hash: codeHash,
      expires_at: expiresAt,
      used: false,
    });

    await this.resetRepository.save(resetToken);
    const emailResult = await this.sendPasswordResetEmail(user.email, code);

    return {
      message:
        'If an account exists for that email, a reset code has been sent.',
      token,
      emailDelivery: emailResult.delivered,
      developmentCode: emailResult.developmentCode,
    };
  }

  /**
   * Verify a reset token and update the user’s password.
   *
   * @param token - Password reset token.
   * @param code - Verification code received via email.
   * @param password - New password to apply.
   * @returns Confirmation message.
   * @throws {BadRequestException} if token, code, or password are invalid.
   */
  async resetPassword(token: string, code: string, password: string) {
    if (!token || !code || !password)
      throw new BadRequestException(
        'Token, verification code, and new password are required.',
      );

    const resetToken = await this.resetRepository.findOne({
      where: { token, used: false },
      relations: ['user'],
    });

    if (!resetToken)
      throw new BadRequestException('Invalid or expired reset request.');

    if (resetToken.expires_at.getTime() < Date.now())
      throw new BadRequestException('Verification code has expired.');

    const matches = await bcrypt.compare(code, resetToken.code_hash);
    if (!matches)
      throw new BadRequestException('Invalid verification code.');

    const user = resetToken.user;
    user.password_hash = await bcrypt.hash(password, 10);
    await this.userRepository.save(user);

    resetToken.used = true;
    await this.resetRepository.save(resetToken);

    return { message: 'Password updated successfully. You can now sign in.' };
  }

  /** Generate a random 6-digit numeric reset code. */
  private generateResetCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send a styled password reset email containing the verification code.
   *
   * @returns Delivery status and (in development) the code itself.
   */
  private async sendPasswordResetEmail(email: string, code: string) {
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      SMTP_SECURE,
      SMTP_FROM,
    } = process.env;

    const host = SMTP_HOST ?? 'smtp.gmail.com';
    const port = SMTP_PORT ? Number(SMTP_PORT) : 465;
    const secure =
      typeof SMTP_SECURE === 'string' ? SMTP_SECURE === 'true' : true;
    const user = SMTP_USER ?? 'leensamady123@gmail.com';
    const pass = SMTP_PASS ?? 'kpzdkrwwjunhbrxi';
    const from = SMTP_FROM ?? user;

    if (!user || !pass) {
      console.warn('SMTP credentials missing. Password reset code:', code);
      return { delivered: false, developmentCode: code };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    try {
      await transporter.sendMail({
        from,
        to: email,
        subject: 'Virtual Closet • Reset your password',
        text: `Hi! Your verification code is: ${code}`,
      });
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return { delivered: false, developmentCode: code };
    }

    return { delivered: true };
  }

  /**
   * Update a user’s profile details such as username, email, or profile image.
   *
   * @param id - User identifier.
   * @param dto - Partial update payload.
   * @returns Updated user object.
   * @throws {NotFoundException} if user does not exist.
   */
  async updateProfile(id: number, dto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    if (!user) throw new NotFoundException('User not found.');

    if (dto.password) user.password_hash = await bcrypt.hash(dto.password, 10);
    if (dto.username) user.username = dto.username;
    if (dto.email) user.email = dto.email;

    if (dto.profile_image_url !== undefined) {
      const sanitized = dto.profile_image_url?.trim() ?? '';
      user.profile_image_url = sanitized.length > 0 ? sanitized : null;
    }

    const updated = await this.userRepository.save(user);
    delete updated.password_hash;

    return { message: 'Profile updated successfully.', user: updated };
  }

  /**
   * Permanently delete a user account.
   *
   * @param id - ID of the user to delete.
   * @returns Confirmation message.
   * @throws {NotFoundException} if user does not exist.
   */
  async deleteUser(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('User not found.');
    return { message: 'User deleted successfully.' };
  }

  /**
   * Retrieve a basic wardrobe summary placeholder for future extensions.
   *
   * @param user_id - User ID to generate summary for.
   * @returns Default summary structure.
   */
  async getWardrobeSummary(user_id: number) {
    return { user_id, total_items: 0, total_outfits: 0, favorites: [] };
  }
}
