import { ICommand } from '@nestjs/cqrs';
import { isValidOrcid } from 'src/util/orcid-checksum';

export class GrantConsentCommand implements ICommand {
  constructor(
    public readonly orcidId: string,
    public readonly permission: string,
  ) {
    if (!isValidOrcid(orcidId)) {
      throw new Error(`The provided ORCID iD ${orcidId} is not valid`);
    }
  }
  public readonly timestamp = new Date();
}
