import { Controller, Get, Query, Res } from '@nestjs/common';
import { OrcidService } from './orcid.service';
import { type Response } from 'express';

@Controller('orcid')
export class OrcidController {
  constructor(protected orcid: OrcidService) {}
  @Get('search')
  async search(@Query('query') query: string, @Res() response: Response) {
    const searchText = `given-and-family-names:${query} OR credit-name:${query}`;
    const orcidResponse = await this.orcid.expandedSearch(searchText);
    response.status(orcidResponse.status).send(orcidResponse.data);
  }
}
