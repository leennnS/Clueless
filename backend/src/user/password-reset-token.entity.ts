/**
 * Entity: PasswordResetToken
 *
 * Represents a single password reset request linked to a user.
 * Stores the reset token, hashed verification code, and expiration timestamp.
 * Used by the authentication service to validate and complete password resets securely.
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('password_reset_tokens')
export class PasswordResetToken {
  /** Auto-incrementing unique identifier for each reset token record */
  @PrimaryGeneratedColumn()
  id: number;

  /** Secure token used to identify a password reset request */
  @Column()
  token: string;

  /** Hashed version of the one-time verification code sent to the user */
  @Column({ name: 'code_hash' })
  code_hash: string;

  /** Date and time after which the token becomes invalid */
  @Column({ name: 'expires_at', type: 'timestamp' })
  expires_at: Date;

  /** Indicates whether the token has been used already */
  @Column({ default: false })
  used: boolean;

  /**
   * Relation: The user to whom this password reset token belongs.
   * Automatically deleted if the user is removed.
   */
  @ManyToOne(() => User, (user) => user.password_reset_tokens, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /** Timestamp marking when the reset token record was created */
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
