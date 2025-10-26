import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { env } from "cloudflare:workers";
import { app } from "../lib/app";
import { supplier } from "../schemas/schemaSuppliers";
import { formatToolResponse } from "../utils";
import { buildQueryString, listQuerySchema } from "./utils";

const supplierCreateSchema = supplier.omit({ id: true });

const supplierUpdateSchema = supplier
  .pick({
    id: true,
    name: true,
    rut: true,
    phoneNumber: true,
    email: true,
    address: true,
  })
  .partial();

const schemas = {
  create: z.array(supplierCreateSchema).optional(),
  update: z.array(supplierUpdateSchema).optional(),
  delete: z.array(supplier.pick({ id: true })).min(1).optional(),
  readAll: listQuerySchema,
};

export function mcpSuppliers(server: McpServer) {
  server.resource("suppliers", "mcp://resource/suppliers", (uri) => {
    return {
      contents: [
        { text: "Suppliers Resource", uri: uri.href },
      ],
    };
  });

  server.tool("SUPPLIERS", "CRUD suppliers", schemas, async (input) => {
    if (input.readAll) {
      try {
        const query = buildQueryString(input.readAll);
        const res = await app.request(
          `/suppliers${query ? `?${query}` : ""}`,
          {
            method: "GET",
            headers: { accept: "application/json" },
          },
          env
        );
        const json = await res.json();
        return formatToolResponse({ json });
      } catch (error) {
        return formatToolResponse({ error, action: "reading suppliers" });
      }
    }

    if (input.create?.length) {
      try {
        const json = await Promise.allSettled(
          input.create.map(async (supplierPayload) => {
            const res = await app.request(
              `/suppliers`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  accept: "application/json",
                },
                body: JSON.stringify(supplierPayload),
              },
              env
            );
            return res.json();
          })
        );
        return formatToolResponse({ json });
      } catch (error) {
        return formatToolResponse({ error, action: "creating suppliers" });
      }
    }

    if (input.update?.length) {
      try {
        const json = await Promise.allSettled(
          input.update.map(async (supplierPayload) => {
            const id = supplierPayload?.id;
            if (typeof id !== "number") {
              throw new Error("Each update payload needs a valid id");
            }
            const { id: _id, ...updatedFields } = supplierPayload;
            const res = await app.request(
              `/suppliers/${id}`,
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
        return formatToolResponse({ error, action: "updating suppliers" });
      }
    }

    if (input.delete?.length) {
      try {
        const json = await Promise.allSettled(
          input.delete.map(async ({ id }) => {
            const res = await app.request(
              `/suppliers/${id}`,
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
        return formatToolResponse({ error, action: "deleting suppliers" });
      }
    }

    return formatToolResponse({ error: "No valid schema provided" });
  });
}
