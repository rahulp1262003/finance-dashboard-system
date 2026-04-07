import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from 'src/auth/dto/register.dto';

export class UpdateRoleDto {
  @IsEnum(UserRole)
  @IsNotEmpty()
  role!: UserRole;
}