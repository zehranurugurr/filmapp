import { LibSQLStore } from '@mastra/libsql';
import { MastraStorage, MastraMessageV1, MastraMessageV2 } from '@mastra/core';

export class CustomV1LibSQLStore extends LibSQLStore implements MastraStorage {
  async saveMessages(args: { messages: MastraMessageV1[]; format?: 'v1' }): Promise<MastraMessageV1[]>;
  async saveMessages(args: { messages: MastraMessageV2[]; format: 'v2' }): Promise<MastraMessageV2[]>;
  async saveMessages(
    args: { messages: MastraMessageV1[]; format?: 'v1' } | { messages: MastraMessageV2[]; format: 'v2' }
  ): Promise<MastraMessageV1[] | MastraMessageV2[]> {
    // Only support v1 messages; throw if format is v2
    if ('format' in args && args.format === 'v2') {
      throw new Error('MastraMessageV2 format is not supported by this storage.');
    }
    // Type assertion is safe here because we only support v1
    return super.saveMessages({ messages: (args as { messages: MastraMessageV1[] }).messages });
  }
}
