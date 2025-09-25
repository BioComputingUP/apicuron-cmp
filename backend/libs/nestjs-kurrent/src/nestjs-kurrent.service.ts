import { Inject, Injectable } from '@nestjs/common';
import { KurrentDBClientToken } from './nestjs-kurrent.providers';
import { KurrentDBClient } from '@kurrent/kurrentdb-client';

@Injectable()
export class NestjsKurrentService {
  constructor(
    @Inject(KurrentDBClientToken)
    private readonly kurrentDBClient: KurrentDBClient,
  ) {}

  get client() {
    return this.kurrentDBClient;
  }
}
