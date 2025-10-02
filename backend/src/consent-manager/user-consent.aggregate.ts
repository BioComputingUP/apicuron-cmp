import {
  OrcidPermissionGranted,
  OrcidPermissionGrantedJSON,
} from './consent-event';
import { FORWARDS, KurrentDBClient, START } from '@kurrent/kurrentdb-client';

// interface EventAggregate<T> {
//   applyEvent(event: T): void;
// }

export class UserConsent {
  private id: string;
  private orcidId: string;
  private grantedPermissions: string[] = [];
  private lastUpdated: Date;
  static revision: bigint;

  static getStream(orcidId: string) {
    return 'users/consent-' + orcidId;
  }

  private constructor() {}

  applyConsentGrantedEvent(event: OrcidPermissionGranted) {
    this.orcidId = event.orcidId;
    if (!this.grantedPermissions.includes(event.permission)) {
      this.grantedPermissions.push(event.permission);
    }
    this.grantedPermissions.push(event.permission);
    this.lastUpdated = event.timestamp;
  }

  static async loadAggregateFromEvents(
    userId: string,
    client: KurrentDBClient,
  ) {
    const events = client.readStream<OrcidPermissionGrantedJSON>(
      this.getStream(userId),
      {
        fromRevision: START,
        direction: FORWARDS,
      },
    );
    const aggregate = new UserConsent();
    for await (const { event } of events) {
      const data = event?.data;
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

  hasConsent(permission: string): boolean {
    return this.grantedPermissions.includes(permission);
  }

  getPermissions(): string[] {
    return [...this.grantedPermissions];
  }
}
