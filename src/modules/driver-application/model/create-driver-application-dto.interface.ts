import { IsEmail, IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateDriverApplicationDto {
  @IsString()
  @Length(2, 50)
  firstName: string;

  @IsString()
  @Length(2, 50)
  lastName: string;

  @IsPhoneNumber('BY')
  phoneNumber: string;

  @IsEmail()
  email: string;
}
