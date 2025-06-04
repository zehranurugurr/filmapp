import { MCPClient } from '@mastra/mcp';

export const mcp = new MCPClient({
  servers: {
    dictionary: {
      url: new URL('https://server.smithery.ai/@zehranurugurr/film_mcp1/mcp?api_key=1098a907-43ad-40a1-a8aa-f62880200a9b'),
    },
  },
}); 