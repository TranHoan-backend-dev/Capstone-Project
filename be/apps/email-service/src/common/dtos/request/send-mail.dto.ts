import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMailDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email address of the recipient',
    example: 'user@example.com',
  })
  to!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Subject of the email',
    example: 'Welcome to our service',
  })
  subject!: string

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Template of the email. It must be one of the following: account-creation, password-reset',
    example: 'account-creation or password-reset',
  })
  template?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the recipient',
    example: 'John Doe',
  })
  name!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Username of the recipient',
    example: 'johndoe',
  })
  username?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Password of the recipient',
    example: 'password123',
  })
  password?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Optional otp used for verify user before resetting password. Otp must contain 6 digits',
    example: '000123',
  })
  otp?: string;
}
