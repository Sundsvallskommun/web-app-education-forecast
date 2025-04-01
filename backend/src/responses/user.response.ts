import ApiResponse from '@/interfaces/api-service.interface';
import { ClientUser } from '@/interfaces/users.interface';
import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';

// export class Permissions implements IPermissions {
//   @IsBoolean()
//   canEditSystemMessages: boolean;
// }

export class User implements ClientUser {
  @IsString()
  personId: string;
  @IsString()
  name: string;
  @IsString()
  username: string;
  @IsArray()
  roles: [{ role: string; typeOfSchool: string }];
  @IsArray()
  schools: [{ schoolId: string; schoolName: string }];
  // @IsEnum(InternalRoleEnum)
  // role: InternalRole;
  // @ValidateNested()
  // @Type(() => Permissions)
  // permissions: Permissions;
}

export class UserApiResponse implements ApiResponse<User> {
  @ValidateNested()
  @Type(() => User)
  data: User;
  @IsString()
  message: string;
}
