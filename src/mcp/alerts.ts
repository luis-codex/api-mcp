import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { env } from "cloudflare:workers";
import { app } from "../lib/app";
import { alert } from "../schemas/schemaAlerts";
import { formatToolResponse } from "../utils";
import { buildQueryString, listQuerySchema } from "./utils";

const alertCreateSchema = alert
  .pick({
    productId: true,
    type: true,
    severity: true,
    status: true,
    message: true,
    assignedTo: true,
  })
  .partial({
    productId: true,
    assignedTo: true,
  });

const alertUpdateSchema = alert
  .pick({
    id: true,
    productId: true,
    type: true,
    severity: true,
    status: true,
    message: true,
    assignedTo: true,
  })
  .partial();

const schemas = {
  create: z.array(alertCreateSchema).optional(),
  update: z.array(alertUpdateSchema).optional(),
  delete: z.array(alert.pick({ id: true })).min(1).optional(),
  readAll: listQuerySchema,
};

export function mcpAlerts(server: McpServer) {
  server.resource("alerts", "mcp://resource/alerts", (uri) => {
    return {
      contents: [
        { text: "Alerts Resource", uri: uri.href },
      ],
    };
  });

  server.tool("ALERTS", "CRUD alerts", schemas, async (input) => {
    if (input.readAll) {
      try {
        const query = buildQueryString(input.readAll);
        const res = await app.request(
          `/alerts${query ? `?${query}` : ""}`,
          {
            method: "GET",
            headers: { accept: "application/json" },
          },
          env
        );
        const json = await res.json();
        return formatToolResponse({ json });
      } catch (error) {
        return formatToolResponse({ error, action: "reading alerts" });
      }
    }

    if (input.create?.length) {
      try {
        const json = await Promise.allSettled(
          input.create.map(async (alertPayload) => {
            const res = await app.request(
              `/alerts`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  accept: "application/json",
                },
                body: JSON.stringify(alertPayload),
              },
              env
            );
            return res.json();
          })
        );
        return formatToolResponse({ json });
      } catch (error) {
        return formatToolResponse({ error, action: "creating alerts" });
      }
    }

    if (input.update?.length) {
      try {
        const json = await Promise.allSettled(
          input.update.map(async (alertPayload) => {
            const id = alertPayload?.id;
            if (typeof id !== "number") {
              throw new Error("Each update payload needs a valid id");
            }
            const { id: _id, ...updatedFields } = alertPayload;
            const res = await app.request(
              `/alerts/${id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  accept: "application/json",
                },
                body: JSON.stringify(updatedFields),
              },
              env
            );
            return res.json();
          })
        );
        return formatToolResponse({ json });
      } catch (error) {
        return formatToolResponse({ error, action: "updating alerts" });
      }
    }

    if (input.delete?.length) {
      try {
        const json = await Promise.allSettled(
          input.delete.map(async ({ id }) => {
            const res = await app.request(
              `/alerts/${id}`,
              {
                method: "DELETE",
                headers: { accept: "application/json" },
              },
              env
            );
            return res.json();
          })
        );
        return formatToolResponse({ json });
      } catch (error) {
        return formatToolResponse({ error, action: "deleting alerts" });
      }
    }

    return formatToolResponse({ error: "No valid schema provided" });
  });
}
