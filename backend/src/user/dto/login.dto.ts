/**
 * DTO: LoginDto
 *
 * Represents the payload required for user authentication.
 * Ensures valid credentials are provided before issuing an access token.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'leen@example.com',
    description: 'Email address associated with the user account',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'User password for authentication',
  })
  @IsNotEmpty()
  password: string;
}
