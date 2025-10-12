import { ICommand } from '@nestjs/cqrs';
import { isValidOrcid } from 'src/util/orcid-checksum';
import { Permission } from '../events';

export class GrantConsentCommand implements ICommand {
  constructor(
    public readonly orcidId: string,
    public readonly permission: Permission,
  ) {
    if (!isValidOrcid(orcidId)) {
      throw new Error(`The provided ORCID iD ${orcidId} is not valid`);
    }
  }
  public readonly timestamp = new Date();
}
