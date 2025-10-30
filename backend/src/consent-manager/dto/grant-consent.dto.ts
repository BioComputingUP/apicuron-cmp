/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { IsOrcid } from 'src/util/orcid-checksum';
import { Permission } from '../events';

export const examplePermissionDto = {
  name: 'Send personal data to third party',
  description: 'Allows sending personal data to a third party.',
  identifier: 'send-personal-data-to-third-party',
} as const;
export class PermissionDto implements Permission {
  @ApiProperty({
    example: examplePermissionDto.name,
    description: 'The name of the permission',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: examplePermissionDto.description,
    description: 'A brief description of the permission',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: examplePermissionDto.identifier,
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
