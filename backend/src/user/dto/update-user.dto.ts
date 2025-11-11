/**
 * DTO: UpdateUserDto
 *
 * Defines the structure for updating user profile details.
 * Allows partial updates where only the provided fields are modified.
 */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Updated username of the user',
    example: 'leen_samadi',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({
    description: 'Updated email address of the user',
    example: 'leen.new@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'New password for the user account',
    example: 'newsecurepassword123',
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    description: 'Updated profile image (can be a hosted URL or Base64 data URL)',
    example: 'https://example.com/uploads/profile123.jpg',
  })
  @IsOptional()
  @IsString()
  profile_image_url?: string;
}
