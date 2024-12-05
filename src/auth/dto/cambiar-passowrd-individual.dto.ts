import { IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDtoIndividual {
  @IsString()
  idPersonal: string;

  @IsString()
  @MinLength(6)
  currentPassword: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
    message: 'Password must contain at least one letter and one number',
  })
  newPassword: string;

  @IsString()
  @MinLength(6)
  confirmNewPassword: string;
}
