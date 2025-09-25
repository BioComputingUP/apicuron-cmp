import {
  AppendStreamState,
  FORWARDS,
  KurrentDBClient,
  NO_STREAM,
  START,
} from '@kurrent/kurrentdb-client';

/**
 * Retrieves the latest revision number from a given event stream.
 *
 * @remarks
 * This function is potentially costly as it iterates through the entire stream to determine the latest revision.
 * Use with caution on large streams, as performance may be impacted.
 *
 * @param client - The KurrentDB client instance used to read the stream.
 * @param streamName - The name of the stream to read revisions from.
 * @returns The latest revision found in the stream, or `NO_STREAM` if the stream is empty.
 */
export async function getLastRevision(
  client: KurrentDBClient,
  streamName: string,
) {
  const events = client.readStream(streamName, {
    fromRevision: START,
    direction: FORWARDS,
  });
  let revision: AppendStreamState = NO_STREAM;

  for await (const { event } of events) {
    revision = event?.revision ?? revision;
  }
  return revision;
}
