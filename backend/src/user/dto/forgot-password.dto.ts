/**
 * DTO: ForgotPasswordDto
 *
 * Represents the payload required to initiate a password reset request.
 * Used when a user submits their email to receive a reset code or link.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Registered email address of the user requesting a password reset',
  })
  @IsEmail()
  email: string;
}
