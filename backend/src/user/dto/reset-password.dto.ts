/**
 * DTO: ResetPasswordDto
 *
 * Represents the payload required to finalize a password reset.
 * Ensures that the reset token, verification code, and new password
 * are valid before updating the user’s credentials.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Secure reset token issued during the password reset request',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Verification code sent to the user’s registered email',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({
    description: 'New password for the user account (minimum 8 characters)',
    example: 'newpassword123',
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
