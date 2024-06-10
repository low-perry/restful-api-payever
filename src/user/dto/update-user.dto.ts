import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  readonly avatar: string;
}
