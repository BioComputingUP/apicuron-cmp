import { ApiResponseProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PermissionDto } from './grant-consent.dto';

export class UserIdentifierDto {
  @ApiResponseProperty({
    example: '0000-0002-1825-0097',
    type: String,
  })
  orcid: string;
}

export class UserPermissionsDto {
  @ApiResponseProperty({
    type: UserIdentifierDto,
  })
  @Type(() => UserIdentifierDto)
  user: UserIdentifierDto;

  @ApiResponseProperty({
    type: [PermissionDto],
  })
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}

export class DataWrapper<T> {
  data: T;
}
