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
import { In, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.dto';
import { UpdateUserInput } from './dto/update-user.dto';
import { PasswordResetToken } from './password-reset-token.entity';
import { LoginInput } from './dto/login.dto';
import { ForgotPasswordInput } from './dto/forgot-password.dto';
import { ResetPasswordInput } from './dto/reset-password.dto';
import {
  AuthPayload,
  MessagePayload,
  PasswordResetRequestPayload,
  UserPayload,
  WardrobeSummary,
  WardrobeColorStat,
  WardrobeTagStat,
  WardrobePreviewItem,
  WardrobePreviewOutfit,
  WardrobeItemStat,
} from './user.types';
import { ClothingItem } from '../clothing-item/clothing-item.entity';
import { Outfit } from '../outfit/outfit.entity';
import { OutfitItem } from '../outfit-item/outfit-item.entity';
import { ScheduledOutfit } from '../scheduled-outfit/scheduled-outfit.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PasswordResetToken)
    private readonly resetRepository: Repository<PasswordResetToken>,
    @InjectRepository(ClothingItem)
    private readonly clothingItemRepository: Repository<ClothingItem>,
    @InjectRepository(Outfit)
    private readonly outfitRepository: Repository<Outfit>,
    @InjectRepository(OutfitItem)
    private readonly outfitItemRepository: Repository<OutfitItem>,
    @InjectRepository(ScheduledOutfit)
    private readonly scheduledOutfitRepository: Repository<ScheduledOutfit>,
  ) {}

  /**
   * Retrieve all registered users with their clothing items.
   * 
   * @precondition Database connection is active.
   * @postcondition Password hashes are removed before returning the response.
   * @throws {InternalServerErrorException} if retrieval fails.
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.userRepository.find({
        relations: ['clothing_items'],
      });
      return users.map((user) => this.sanitizeUser(user));
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
  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { user_id: id },
      relations: ['clothing_items'],
    });
    if (!user) throw new NotFoundException('User not found.');
    return this.sanitizeUser(user);
  }

  /**
   * Register a new user account with hashed password storage.
   *
   * @param dto - Validated registration payload.
   * @returns Newly created user data without sensitive fields.
   * @throws {ConflictException} if username or email already exists.
   * @throws {BadRequestException} if required fields are missing.
   */
  async register(input: CreateUserInput): Promise<UserPayload> {
    const { username, email, password } = input;

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
      user: this.sanitizeUser(savedUser),
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
  async login(input: LoginInput): Promise<AuthPayload> {
    const { email, password } = input;
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: ['user_id', 'email', 'username', 'password_hash', 'profile_image_url'],
      });

      if (!user) throw new UnauthorizedException('Invalid email or password.');

      const passwordHash = user.password_hash;
      if (!passwordHash)
        throw new UnauthorizedException('Invalid email or password.');

      const isPasswordValid = await bcrypt.compare(password, passwordHash);
      if (!isPasswordValid)
        throw new UnauthorizedException('Invalid email or password.');

      const jwtSecret = this.getRequiredEnv('JWT_SECRET');
      const token = jwt.sign(
        { id: user.user_id, email: user.email },
        jwtSecret,
        { expiresIn: '1h' },
      );

      return {
        message: 'Login successful.',
        token,
        user: this.sanitizeUser(user),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
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
  async requestPasswordReset(input: ForgotPasswordInput): Promise<PasswordResetRequestPayload> {
    const { email } = input;
    if (!email) throw new BadRequestException('Email is required.');

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return {
        message:
          'If an account exists for that email, a reset code has been sent.',
        resetToken: randomUUID(),
        emailDelivery: false,
        email,
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
      resetToken: token,
      email,
      emailDelivery: emailResult.delivered,
      resetCode: emailResult.code,
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
  async resetPassword(input: ResetPasswordInput): Promise<MessagePayload> {
    const { token, code, password } = input;
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
    const host = this.getRequiredEnv('SMTP_HOST');
    const port = this.getRequiredNumberEnv('SMTP_PORT');
    const secureEnv = process.env.SMTP_SECURE ?? 'true';
    const secure = secureEnv.toLowerCase() === 'true';
    const user = this.getRequiredEnv('SMTP_USER');
    const pass = this.getRequiredEnv('SMTP_PASS');
    const from = process.env.SMTP_FROM ?? user;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f7f1ff; padding: 32px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; box-shadow: 0 12px 30px rgba(142, 90, 198, 0.12); overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #ff5fa2 0%, #8e5ac6 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #fff; font-size: 24px; letter-spacing: 0.5px;">Virtual Closet</h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Password Reset Verification</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px; color: #3a2b4d; font-size: 16px;">Hi there,</p>
              <p style="margin: 0 0 16px; color: #4b3b63; line-height: 1.6;">
                We received a request to reset the password for your Virtual Closet account. Use the verification code below to proceed.
              </p>
              <div style="margin: 24px 0; text-align: center;">
                <span style="display: inline-block; padding: 16px 32px; font-size: 28px; font-weight: 700; letter-spacing: 4px; color: #ff5fa2; background: #fff4fa; border-radius: 12px; border: 2px solid #ffb9d7;">
                  ${code}
                </span>
              </div>
              <p style="margin: 0 0 16px; color: #4b3b63; line-height: 1.6;">
                This code will expire in <strong>15 minutes</strong>. If you didn’t request a reset, you can ignore this email and your password will remain the same.
              </p>
              <p style="margin: 32px 0 0; color: #4b3b63;">
                With love,<br/>
                <strong>The Virtual Closet Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background: #faf5ff; padding: 16px; text-align: center; color: #7c6b95; font-size: 12px;">
              Need help? Reply to this email and we’ll get back to you shortly.
            </td>
          </tr>
        </table>
      </div>
    `;

    try {
      await transporter.sendMail({
        from,
        to: email,
        subject: 'Virtual Closet • Reset your password',
        text: `Your Virtual Closet verification code is: ${code}. It expires in 15 minutes.`,
        html,
      });
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return { delivered: false, code };
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
  async updateProfile(input: UpdateUserInput): Promise<UserPayload> {
    const user = await this.userRepository.findOne({ where: { user_id: input.id } });
    if (!user) throw new NotFoundException('User not found.');

    if (input.password) user.password_hash = await bcrypt.hash(input.password, 10);
    if (input.username) user.username = input.username;
    if (input.email) user.email = input.email;

    if (input.profile_image_url !== undefined) {
      const sanitized = input.profile_image_url?.trim() ?? '';
      user.profile_image_url = sanitized.length > 0 ? sanitized : null;
    }

    const updated = await this.userRepository.save(user);

    return { message: 'Profile updated successfully.', user: this.sanitizeUser(updated) };
  }

  /**
   * Permanently delete a user account.
   *
   * @param id - ID of the user to delete.
   * @returns Confirmation message.
   * @throws {NotFoundException} if user does not exist.
   */
  async deleteUser(id: number): Promise<MessagePayload> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('User not found.');
    return { message: 'User deleted successfully.' };
  }

  /**
   * Generate wardrobe insights for the profile dashboard.
   *
   * Aggregates wardrobe totals, latest uploads, color preferences,
   * tag popularity, and calendar-based wear counts.
   */
  async getWardrobeSummary(user_id: number): Promise<WardrobeSummary> {
    const [items, outfits, scheduledLooks] = await Promise.all([
      this.clothingItemRepository.find({
        where: { user: { user_id } },
        relations: ['clothing_item_tags', 'clothing_item_tags.tag'],
        order: { updated_at: 'DESC' },
      }),
      this.outfitRepository.find({
        where: { user: { user_id } },
        order: { updated_at: 'DESC' },
      }),
      this.scheduledOutfitRepository.find({
        where: { user: { user_id } },
        relations: ['outfit'],
      }),
    ]);

    const totalItems = items.length;
    const totalOutfits = outfits.length;

    const latestItems: WardrobePreviewItem[] = items.slice(0, 6).map((item) => ({
      item_id: item.item_id,
      name: item.name,
      category: item.category,
      color: item.color ?? null,
      image_url: item.image_url ?? null,
    }));

    const latestOutfits: WardrobePreviewOutfit[] = outfits.slice(0, 6).map((outfit) => ({
      outfit_id: outfit.outfit_id,
      name: outfit.name,
      cover_image_url: outfit.cover_image_url ?? null,
      is_public: outfit.is_public ?? false,
    }));

    const favoriteColors = this.buildColorStats(items);
    const topTags = this.buildTagStats(items);
    const favorites = topTags.map((entry) => entry.tag);

    const mostWornItem = await this.resolveMostWornItem(scheduledLooks);

    return {
      user_id,
      total_items: totalItems,
      total_outfits: totalOutfits,
      favorites,
      latest_items: latestItems,
      latest_outfits: latestOutfits,
      favorite_colors: favoriteColors,
      top_tags: topTags,
      most_worn_item: mostWornItem,
    };
  }

  private buildColorStats(items: ClothingItem[]): WardrobeColorStat[] {
    const counts = new Map<string, number>();
    for (const item of items) {
      const color = item.color?.trim();
      if (!color) continue;
      const normalized = color.toLowerCase();
      counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([normalized, count]) => ({
        color: this.capitalizeWord(normalized),
        count,
      }));
  }

  private buildTagStats(items: ClothingItem[]): WardrobeTagStat[] {
    const counts = new Map<string, number>();
    for (const item of items) {
      for (const link of item.clothing_item_tags ?? []) {
        const tagName = link?.tag?.name?.trim();
        if (!tagName) continue;
        const normalized = tagName.toLowerCase();
        counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
      }
    }

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([normalized, count]) => ({
        tag: this.capitalizeWord(normalized),
        count,
      }));
  }

  private async resolveMostWornItem(
    scheduledLooks: ScheduledOutfit[],
  ): Promise<WardrobeItemStat | null> {
    if (!scheduledLooks.length) {
      return null;
    }

    const outfitWearCounts = new Map<number, number>();
    for (const entry of scheduledLooks) {
      const outfitId =
        entry.outfit?.outfit_id ?? (entry as unknown as { outfit_id?: number }).outfit_id;
      if (!outfitId) {
        continue;
      }
      outfitWearCounts.set(outfitId, (outfitWearCounts.get(outfitId) ?? 0) + 1);
    }

    if (!outfitWearCounts.size) {
      return null;
    }

    const outfitItems = await this.outfitItemRepository.find({
      where: { outfit: { outfit_id: In(Array.from(outfitWearCounts.keys())) } },
      relations: ['item', 'outfit'],
    });

    const itemCounts = new Map<number, { item: ClothingItem; count: number }>();
    for (const link of outfitItems) {
      const outfitId = link.outfit?.outfit_id;
      const wearerCount = outfitId ? outfitWearCounts.get(outfitId) ?? 0 : 0;
      if (!wearerCount || !link.item) {
        continue;
      }
      const current = itemCounts.get(link.item.item_id) ?? {
        item: link.item,
        count: 0,
      };
      current.count += wearerCount;
      itemCounts.set(link.item.item_id, current);
    }

    if (!itemCounts.size) {
      return null;
    }

    const [itemId, data] = Array.from(itemCounts.entries()).sort(
      (a, b) => b[1].count - a[1].count,
    )[0];

    return {
      item_id: itemId,
      name: data.item.name,
      category: data.item.category,
      color: data.item.color ?? null,
      image_url: data.item.image_url ?? null,
      wear_count: data.count,
    };
  }

  private capitalizeWord(value: string): string {
    if (!value) {
      return value;
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  private sanitizeUser(user: User): User {
    const cloned = { ...user };
    delete cloned.password_hash;
    return cloned as User;
  }

  private getRequiredEnv(name: string) {
    const value = process.env[name];
    if (!value) {
      throw new InternalServerErrorException(
        `${name} environment variable is not configured.`,
      );
    }
    return value;
  }

  private getRequiredNumberEnv(name: string) {
    const raw = this.getRequiredEnv(name);
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) {
      throw new InternalServerErrorException(
        `${name} environment variable must be a valid number.`,
      );
    }
    return parsed;
  }
}
