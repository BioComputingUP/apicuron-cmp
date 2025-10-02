/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsOrcid } from 'src/util/orcid-checksum';

export class OrcidGrantConsentDto {
  @ApiProperty()
  @IsOrcid()
  @IsString()
  @IsNotEmpty()
  orcidId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  permission: string;
}
