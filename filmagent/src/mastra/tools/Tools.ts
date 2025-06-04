import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const FilmsTool = createTool({
  id: "get_films",
  description: "Get information about a films from the film MCP server",
  inputSchema: z.object({
    name: z.string(),
  }),
  outputSchema: z.any(),
  execute: async (ctx) => {
    // Use ctx.input if available, otherwise ctx as fallback
    const input = (ctx as any).input ?? ctx;
    const { name } = input;
    const response = await fetch(
      "https://server.smithery.ai/@zehranurugurr/film_mcp1/mcp?api_key=1098a907-43ad-40a1-a8aa-f62880200a9b",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          method: "tools/call",
          params: {
            name: "get_films",
            arguments: {
              name: name,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`API error: ${data.error.message}`);
    }

    return data.result;
  },
});