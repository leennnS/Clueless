/**
 * DTO: ForgotPasswordDto
 *
 * Represents the payload required to initiate a password reset request.
 * Used when a user submits their email to receive a reset code or link.
 */
import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class ForgotPasswordInput {
  @Field()
  @IsEmail()
  email: string;
}
