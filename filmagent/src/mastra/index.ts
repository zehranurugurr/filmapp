import { Mastra } from '@mastra/core';
import { PinoLogger } from '@mastra/loggers';
import { CustomV1LibSQLStore } from './CustomV1LibSQLStore'; 
import { filmAgent } from './agents/agent';

export const mastra = new Mastra({
  agents: { filmAgent },
  storage: new CustomV1LibSQLStore({
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
