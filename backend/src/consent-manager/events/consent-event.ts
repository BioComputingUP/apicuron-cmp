import { JSONEventType } from '@kurrent/kurrentdb-client/dist/types/events';
import {
  OrcidPermissionGranted,
  OrcidPermissionGrantedEventType,
} from './permission-granted';

// Consent Revoked Event
export const OrcidPermissionRevokedType = 'OrcidConsentRevokedV1';
export type OrcidPermissionRevoked = {
  orcidId: string;
  permission: string;
  timestamp: Date;
};
export type OrcidPermissionRevokedJSON = JSONEventType<
  typeof OrcidPermissionRevokedType,
  OrcidPermissionRevoked
>;

// User Consent Event (Union of all events)
export type OrcidPermissionJSONEvent =
  | OrcidPermissionGrantedEventType
  | OrcidPermissionRevokedJSON;

export type UserConsentEvent = OrcidPermissionGranted | OrcidPermissionRevoked;
