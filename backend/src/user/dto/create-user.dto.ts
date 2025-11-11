/**
 * DTO: CreateUserDto
 *
 * Represents the payload required to register a new user.
 * Ensures validation of essential account fields before persistence.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'leen',
    description: 'Unique username chosen by the user',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'leen@example.com',
    description: 'Valid email address for authentication and communication',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'User password (minimum 6 characters)',
  })
  @MinLength(6)
  password: string;
}
