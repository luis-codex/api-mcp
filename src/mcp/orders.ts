import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { env } from "cloudflare:workers";
import { z } from "zod";
import { app } from "../lib/app";
import { order } from "../schemas/schemaOrders";
import { formatToolResponse } from "../utils";

export function mcpOrders(server: McpServer) {
  server.resource("orders", "mcp://resource/orders", (uri) => {
    return {
      contents: [{ text: "Orders Resource", uri: uri.href }],
    };
  });

  server.tool(
    "ORDERS",
    "CRUD orders",
    {
      action: z.enum(["create", "readAll", "update", "delete"]),
      payload: order.optional(),
    },
    async ({ action, payload }) => {
      switch (action) {
        case "create": {
          try {
            const res = await app.request(
              "/orders",
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
            return formatToolResponse({ error, action: "creating order" });
          }
        }
        case "readAll": {
          try {
            const res = await app.request(
              "/orders",
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
            return formatToolResponse({ error, action: "getting orders" });
          }
        }

        case "update": {
          try {
            if (!payload || !payload.id) {
              throw new Error("Payload with valid id is required for update");
            }
            const res = await app.request(
              `/orders/${payload.id}`,
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
            return formatToolResponse({ error, action: "updating order" });
          }
        }
        case "delete": {
          try {
            if (!payload || !payload.id) {
              throw new Error("Payload with valid id is required for delete");
            }
            const res = await app.request(
              `/orders/${payload.id}`,
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
            return formatToolResponse({ error, action: "deleting order" });
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
