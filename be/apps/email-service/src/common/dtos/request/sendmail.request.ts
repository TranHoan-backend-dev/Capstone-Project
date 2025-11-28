import {IsEmail, IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class SendMailDto {
  @IsEmail()
  @IsNotEmpty()
  to!: string

  @IsNotEmpty()
  @IsString()
  subject!: string

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  template?: string;
}
