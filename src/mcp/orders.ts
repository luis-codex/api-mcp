import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { env } from "cloudflare:workers";
import { app } from "../lib/app";
import { order } from "../schemas/schemaOrders";
import { formatToolResponse } from "../utils";
import { buildQueryString, listQuerySchema } from "./utils";

const orderCreateSchema = order
  .pick({
    productId: true,
    status: true,
    priority: true,
    quantity: true,
    requestedBy: true,
    notes: true,
    expectedArrival: true,
  })
  .partial({
    notes: true,
    expectedArrival: true,
  });

const orderUpdateSchema = order
  .pick({
    id: true,
    productId: true,
    status: true,
    priority: true,
    quantity: true,
    requestedBy: true,
    notes: true,
    expectedArrival: true,
  })
  .partial();

const schemas = {
  create: z.array(orderCreateSchema).optional(),
  update: z.array(orderUpdateSchema).optional(),
  delete: z.array(order.pick({ id: true })).min(1).optional(),
  readAll: listQuerySchema,
};

export function mcpOrders(server: McpServer) {
  server.resource("orders", "mcp://resource/orders", (uri) => {
    return {
      contents: [
        { text: "Orders Resource", uri: uri.href },
      ],
    };
  });

  server.tool("ORDERS", "CRUD orders", schemas, async (input) => {
    if (input.readAll) {
      try {
        const query = buildQueryString(input.readAll);
        const res = await app.request(
          `/orders${query ? `?${query}` : ""}`,
          {
            method: "GET",
            headers: { accept: "application/json" },
          },
          env
        );
        const json = await res.json();
        return formatToolResponse({ json });
      } catch (error) {
        return formatToolResponse({ error, action: "reading orders" });
      }
    }

    if (input.create?.length) {
      try {
        const json = await Promise.allSettled(
          input.create.map(async (orderPayload) => {
            const res = await app.request(
              `/orders`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  accept: "application/json",
                },
                body: JSON.stringify(orderPayload),
              },
              env
            );
            return res.json();
          })
        );
        return formatToolResponse({ json });
      } catch (error) {
        return formatToolResponse({ error, action: "creating orders" });
      }
    }

    if (input.update?.length) {
      try {
        const json = await Promise.allSettled(
          input.update.map(async (orderPayload) => {
            const id = orderPayload?.id;
            if (typeof id !== "number") {
              throw new Error("Each update payload needs a valid id");
            }
            const { id: _id, ...updatedFields } = orderPayload;
            const res = await app.request(
              `/orders/${id}`,
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
        return formatToolResponse({ error, action: "updating orders" });
      }
    }

    if (input.delete?.length) {
      try {
        const json = await Promise.allSettled(
          input.delete.map(async ({ id }) => {
            const res = await app.request(
              `/orders/${id}`,
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
        return formatToolResponse({ error, action: "deleting orders" });
      }
    }

    return formatToolResponse({ error: "No valid schema provided" });
  });
}
