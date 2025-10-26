import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { env } from "cloudflare:workers";
import { z } from "zod";
import { app } from "../lib/app";
import { alert } from "../schemas/schemaAlerts";
import { formatToolResponse } from "../utils";

export function mcpAlerts(server: McpServer) {
  server.resource("alerts", "mcp://resource/alerts", (uri) => {
    return {
      contents: [{ text: "Alerts Resource", uri: uri.href }],
    };
  });

  server.tool(
    "ALERTS",
    "CRUD alerts",
    {
      action: z.enum(["create", "readAll", "update", "delete"]),
      payload: alert.optional(),
    },
    async ({ action, payload }) => {
      switch (action) {
        case "create": {
          try {
            const res = await app.request(
              "/alerts",
              {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                  "Content-Type": "application/json",
                  accept: "application/json",
                },
              },
              env
            );
            const json = await res.json();
            return formatToolResponse({ json });
          } catch (error) {
            return formatToolResponse({ error, action: "creating alert" });
          }
        }
        case "readAll": {
          try {
            const res = await app.request(
              "/alerts",
              {
                method: "GET",
                headers: {
                  accept: "application/json",
                },
              },
              env
            );
            const json = await res.json();
            return formatToolResponse({ json });
          } catch (error) {
            return formatToolResponse({ error, action: "getting alerts" });
          }
        }

        case "update": {
          try {
            if (!payload || !payload.id) {
              throw new Error("Payload with valid id is required for update");
            }
            const res = await app.request(
              `/alerts/${payload.id}`,
              {
                method: "PUT",
                body: JSON.stringify(payload),
                headers: {
                  "Content-Type": "application/json",
                  accept: "application/json",
                },
              },
              env
            );
            const json = await res.json();
            return formatToolResponse({ json });
          } catch (error) {
            return formatToolResponse({ error, action: "updating alert" });
          }
        }
        case "delete": {
          try {
            if (!payload || !payload.id) {
              throw new Error("Payload with valid id is required for delete");
            }
            const res = await app.request(
              `/alerts/${payload.id}`,
              {
                method: "DELETE",
                headers: {
                  accept: "application/json",
                },
              },
              env
            );
            const json = await res.json();
            return formatToolResponse({ json });
          } catch (error) {
            return formatToolResponse({ error, action: "deleting alert" });
          }
        }
        default:
          return {
            content: [{ text: "Acción no reconocida", type: "text" }],
          };
      }
    }
  );
}
