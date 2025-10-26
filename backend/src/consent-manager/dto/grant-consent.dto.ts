/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { IsOrcid } from 'src/util/orcid-checksum';
import { Permission } from '../events';
export class PermissionDto implements Permission {
  @ApiProperty({
    example: 'Send personal data to third party',
    description: 'The name of the permission',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Allows the application to send personal data to a third party.',
    description: 'A brief description of the permission',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'send-personal-data-to-third-party',
    description: 'The unique identifier for the permission',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;
}

export class OrcidGrantConsentDto {
  @ApiProperty({
    example: '0000-0002-2472-5685',
    description: 'The ORCID iD of the user granting consent',
  })
  @IsOrcid()
  @IsString()
  @IsNotEmpty()
  orcidId: string;

  @ApiProperty({
    type: PermissionDto,
    description: 'The permission being granted',
  })
  @ValidateNested()
  @IsNotEmpty()
  permission: PermissionDto;
}
