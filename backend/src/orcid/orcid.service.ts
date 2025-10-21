import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrcidService {
  orcidUrl: URL;

  constructor(
    protected httpService: HttpService,
    protected config: ConfigService,
  ) {
    const orcidApiUrl = this.config.getOrThrow<string>('ORCID_API_URL');
    this.orcidUrl = new URL(orcidApiUrl);
    console.log('ORCID API URL:', this.orcidUrl.href);
  }
  async expandedSearch(solrQuery: string) {
    const response = await this.httpService.axiosRef.get(
      `${this.orcidUrl.href}expanded-search`,
      {
        params: {
          q: solrQuery,
          rows: 20,
        },
        headers: {
          Accept: 'application/orcid+json',
        },
        validateStatus: () => true,
      },
    );

    return response;
  }
}
