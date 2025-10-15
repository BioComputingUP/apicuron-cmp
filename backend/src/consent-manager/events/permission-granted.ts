import {
  EventTypeToEventData,
  EventTypeToRecordedEvent,
  JSONEventType,
} from '@kurrent/kurrentdb-client';
import { StreamEvent } from './stream-event';
import { EventClassInstance } from '../interfaces/events';

export const OrcidPermissionGrantedType = 'OrcidConsentGrantedV1';
// Consent Granted Event
// TODO: move to appropriate place
export type Permission = {
  identifier: string;
  name: string;
  description: string;
};

export type OrcidPermissionGranted = {
  orcidId: string;
  permission: Permission;
  timestamp: Date;
};

export type OrcidPermissionGrantedEventType = JSONEventType<
  typeof OrcidPermissionGrantedType,
  OrcidPermissionGranted
>;
export type OrcidPermissionGrantedEventData =
  EventTypeToEventData<OrcidPermissionGrantedEventType>;

export type RecordedOrcidPermissionGrantedEvent =
  EventTypeToRecordedEvent<OrcidPermissionGrantedEventType>;

export class OrcidPermissionGrantedEvent
  implements EventClassInstance<OrcidPermissionGranted>
{
  public type = OrcidPermissionGrantedType;
  public readonly orcidId: string;
  public readonly permission: Permission;
  public readonly timestamp: Date;
  public readonly revision: bigint;
  constructor(public readonly event$: RecordedOrcidPermissionGrantedEvent) {
    this.orcidId = event$.data.orcidId;
    this.permission = event$.data.permission;
    this.timestamp = event$.data.timestamp;
    this.revision = event$.revision;
  }
}

export function OrcidPermissionGrantedEventFactory(
  event: RecordedOrcidPermissionGrantedEvent,
): OrcidPermissionGrantedEvent {
  if (!event) {
    throw new Error('Event is undefined');
  }
  return new OrcidPermissionGrantedEvent(event);
}

export const OrcidPermissionGrantedStreamEvent = StreamEvent(
  OrcidPermissionGrantedType,
  OrcidPermissionGrantedEvent,
  OrcidPermissionGrantedEventFactory,
);
