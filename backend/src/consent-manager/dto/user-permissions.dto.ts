import {
  ApiProperty,
  ApiResponseProperty,
  ApiSchema,
  IntersectionType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PermissionDto } from './grant-consent.dto';
import { OrcidRegex } from 'src/util/orcid-checksum';

@ApiSchema({
  description: 'An object identifying the user (using ORCID ID)',
})
export class UserIdentifierDto {
  @ApiProperty({
    example: '0000-0002-1825-0097',
    description: 'The ORCID ID of the user',
    pattern: OrcidRegex.source,
    required: true,
    type: String,
  })
  orcid: string;
}

export class PermissionIdDto {
  @ApiProperty({
    example: 'send-personal-data-to-third-party',
    description: 'A unique identifier for a permission',
    type: String,
    pattern: '^[a-z0-9-]+$',
    required: true,
  })
  permission_id: string;
}

export class PermissionUserIdDto extends IntersectionType(
  UserIdentifierDto,
  PermissionIdDto,
) {}

export class UserPermissionsDto {
  @ApiProperty({
    type: UserIdentifierDto,
  })
  @Type(() => UserIdentifierDto)
  user: UserIdentifierDto;

  @ApiProperty({
    type: [PermissionDto],
    description: 'List of permissions the user has consented to',
  })
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}

export class DataWrapper<T> {
  data: T;
}

export class UserHasPermissionDto {
  @ApiProperty({
    type: UserIdentifierDto,
    readOnly: true,
  })
  user: UserIdentifierDto;

  @ApiProperty({
    required: false,
    readOnly: true,
    type: PermissionDto,
    description: 'Permission can be null if not granted',
  })
  permission?: PermissionDto | null;

  @ApiResponseProperty({
    type: Boolean,
  })
  hasPermission: boolean;
}
