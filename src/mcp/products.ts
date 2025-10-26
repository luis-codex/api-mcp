import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { env } from "cloudflare:workers";
import { z } from "zod";
import { app } from "../lib/app";
import { product } from "../schemas/schemaProducts";
import { formatToolResponse } from "../utils";

export function mcpProducts(server: McpServer) {
  server.resource("products", "mcp://resource/products", (uri) => {
    return {
      contents: [
        { text: "Products Resource", uri: uri.href },
        { text: "Hola desde productos", uri: uri.href },
      ],
    };
  });

  server.tool(
    "PRODUCTS",
    "CRUD products",
    {
      action: z.enum(["create", "readAll", "update", "delete"]),
      payload: product.optional(),
    },
    async ({ action, payload }) => {
      switch (action) {
        case "create": {
          try {
            const res = await app.request(
              "/products",
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
            return formatToolResponse({ error, action: "creating product" });
          }
        }
        case "readAll": {
          try {
            const res = await app.request(
              "/products",
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
            return formatToolResponse({ error, action: "getting products" });
          }
        }

        case "update": {
          try {
            if (!payload || !payload.id) {
              throw new Error("Payload with valid id is required for update");
            }
            const res = await app.request(
              `/products/${payload.id}`,
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
            return formatToolResponse({ error, action: "updating product" });
          }
        }
        case "delete": {
          try {
            if (!payload || !payload.id) {
              throw new Error("Payload with valid id is required for delete");
            }
            const res = await app.request(
              `/products/${payload.id}`,
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
            return formatToolResponse({ error, action: "deleting product" });
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
