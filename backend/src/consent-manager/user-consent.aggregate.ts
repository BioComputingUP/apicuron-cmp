import {
  OrcidPermissionGranted,
  OrcidPermissionGrantedEventType,
  OrcidPermissionGrantedType,
  Permission,
} from './events';
import { FORWARDS, KurrentDBClient, START } from '@kurrent/kurrentdb-client';

export class UserConsent {
  private id: string;
  private orcidId: string;
  private grantedPermissions: Permission[] = [];
  private lastUpdated: Date;
  static revision: bigint;
  static baseStream = 'usersconsent';

  static getStream(orcidId: string) {
    return `${this.baseStream}-${orcidId}`;
  }

  private constructor() {}

  applyConsentGrantedEvent(event: OrcidPermissionGranted) {
    this.orcidId = event.orcidId;
    if (!this.hasConsent(event.permission)) {
      this.grantedPermissions.push(event.permission);
    }
    this.lastUpdated = event.timestamp;
  }

  static async loadAggregateFromEvents(
    userId: string,
    client: KurrentDBClient,
  ) {
    const events = client.readStream<OrcidPermissionGrantedEventType>(
      this.getStream(userId),
      {
        fromRevision: START,
        direction: FORWARDS,
      },
    );
    const aggregate = new UserConsent();
    for await (const { event } of events) {
      if (event?.type != OrcidPermissionGrantedType) {
        continue;
      }
      const data = event.data;
      const revision = event?.revision;
      if (!data || !revision) {
        throw new Error('Event data or revision is undefined');
      }
      this.revision = revision;
      aggregate.applyConsentGrantedEvent(data);
    }
    return aggregate;
  }

  applyEvents() {}

  hasConsent(permission: Permission): boolean {
    const index = this.grantedPermissions.findIndex(
      (perm) => perm.identifier === permission.identifier,
    );
    return index !== -1;
  }

  getPermissions(): Permission[] {
    return [...this.grantedPermissions];
  }
}
