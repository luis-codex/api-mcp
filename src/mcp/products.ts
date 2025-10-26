import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { product } from "../schemas/schemaProducts";
import { app } from "../lib/app";
import { env } from "cloudflare:workers";
import { formatToolResponse } from "../utils";

const schemas = {
  create: z.array(product.omit({ id: true, slug: true })).optional(),
  update: z.array(product.partial()).optional(),
  delete: z
    .array(product.pick({ id: true }))
    .min(1)
    .optional(),
  readAll: z
    .object({
      page: z.number().int().optional(),
      per_page: z.number().int().optional(),
      search: z.string().optional(),
    })
    .optional(),
};

export function mcpProducts(server: McpServer) {
  server.resource("products", "mcp://resource/products", (uri) => {
    return {
      contents: [
        { text: "Products Resource", uri: uri.href },
        { text: "Hola desde productos", uri: uri.href },
      ],
    };
  });

  server.tool("PRODUCTS", "CRUD products", schemas, async (input) => {
    if (input.readAll) {
      try {
        const params = new URLSearchParams();
        Object.assign(params, input.readAll);
        const query = params.toString();
        const res = await app.request(
          `/products${query ? `?${query}` : ""}`,
          {
            method: "GET",
            headers: { accept: "application/json" },
          },
          env
        );
        const json = await res.json();
        return formatToolResponse({ json });
      } catch (error) {
        return formatToolResponse({ error, action: "reading products" });
      }
    }

    if (input.create?.length) {
      try {
        const json = await Promise.allSettled(
          input.create.map(async (productPayload) => {
            const res = await app.request(
              `/products`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  accept: "application/json",
                },
                body: JSON.stringify(productPayload),
              },
              env
            );
            return res.json();
          })
        );
        return formatToolResponse({ json });
      } catch (error) {
        return formatToolResponse({ error, action: "creating products" });
      }
    }

    if (input.update?.length) {
      try {
        const json = await Promise.allSettled(
          input.update.map(async (productPayload) => {
            const id = productPayload?.id;
            if (typeof id !== "number") {
              throw new Error("Each update payload needs a valid id");
            }
            const { id: _id, ...updatedFields } = productPayload;
            const res = await app.request(
              `/products/${id}`,
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
        return formatToolResponse({ error, action: "updating products" });
      }
    }

    if (input.delete?.length) {
      try {
        const json = await Promise.allSettled(
          input.delete.map(async ({ id }) => {
            const res = await app.request(
              `/products/${id}`,
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
        return formatToolResponse({ error, action: "deleting products" });
      }
    }

    return formatToolResponse({ error: "No valid schema provided" });
  });
}
