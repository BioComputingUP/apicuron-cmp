import { JSONEventType } from '@kurrent/kurrentdb-client/dist/types/events';

export const OrcidPermissionGrantedType = 'OrcidConsentGrantedV1';
// Consent Granted Event
export type OrcidPermissionGranted = {
  orcidId: string;
  permission: string;
  timestamp: Date;
};

export type OrcidPermissionGrantedJSON = JSONEventType<
  typeof OrcidPermissionGrantedType,
  OrcidPermissionGranted
>;

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
  | OrcidPermissionGrantedJSON
  | OrcidPermissionRevokedJSON;

export type UserConsentEvent = OrcidPermissionGranted | OrcidPermissionRevoked;
