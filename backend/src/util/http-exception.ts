import { type HttpExceptionBodyMessage } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class HttpExceptionBody {
  @ApiProperty()
  message: HttpExceptionBodyMessage;
  @ApiProperty()
  error?: string;
  @ApiProperty()
  statusCode: number;
}
