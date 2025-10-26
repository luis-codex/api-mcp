import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { env } from "cloudflare:workers";
import { z } from "zod";
import { app } from "../lib/app";
import { supplier } from "../schemas/schemaSuppliers";
import { formatToolResponse } from "../utils";

export function mcpSuppliers(server: McpServer) {
  server.resource("suppliers", "mcp://resource/suppliers", (uri) => {
    return {
      contents: [{ text: "Suppliers Resource", uri: uri.href }],
    };
  });

  server.tool(
    "SUPPLIERS",
    "CRUD suppliers",
    {
      action: z.enum(["create", "readAll", "update", "delete"]),
      payload: supplier.optional(),
    },
    async ({ action, payload }) => {
      switch (action) {
        case "create": {
          try {
            const res = await app.request(
              "/suppliers",
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
            return formatToolResponse({ error, action: "creating supplier" });
          }
        }
        case "readAll": {
          try {
            const res = await app.request(
              "/suppliers",
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
            return formatToolResponse({ error, action: "getting suppliers" });
          }
        }

        case "update": {
          try {
            if (!payload || !payload.id) {
              throw new Error("Payload with valid id is required for update");
            }
            const res = await app.request(
              `/suppliers/${payload.id}`,
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
            return formatToolResponse({ error, action: "updating supplier" });
          }
        }
        case "delete": {
          try {
            if (!payload || !payload.id) {
              throw new Error("Payload with valid id is required for delete");
            }
            const res = await app.request(
              `/suppliers/${payload.id}`,
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
            return formatToolResponse({ error, action: "deleting supplier" });
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
