import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { ApiException, fromHono } from "chanfana";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { alertsRouter } from "./endpoints/alerts/router";
import { ordersRouter } from "./endpoints/orders/router";
import { productsRouter } from "./endpoints/products/router";
import { suppliersRouter } from "./endpoints/suppliers/router";
import { app } from "./lib/app";
import { mcpAlerts, mcpOrders, mcpProducts, mcpSuppliers } from "./mcp";

export class MCP_OBJECT extends McpAgent<Cloudflare.Env> {
  server = new McpServer({
    name: "MCP SUPERMARKET",
    version: "1.0.0",
  });

  async init() {
    mcpProducts(this.server);
    mcpSuppliers(this.server);
    mcpOrders(this.server);
    mcpAlerts(this.server);
  }
}

app.onError((err, c) => {
  if (err instanceof ApiException) {
    return c.json(
      { success: false, errors: err.buildResponse() },
      err.status as ContentfulStatusCode
    );
  }
  console.error("Global error handler caught:", err);
  return c.json(
    {
      success: false,
      errors: [{ code: 7000, message: "Internal Server Error" }],
    },
    500
  );
});

const openapi = fromHono(app, {
  docs_url: "/",
  schema: {
    info: {
      title: "Supermarket API",
      version: "1.0.0",
      description: "API for managing supermarket",
    },
  },
});

app.mount("/mcp", MCP_OBJECT.serve("/mcp", { binding: "MCP" }).fetch, {
  replaceRequest: false,
});
openapi.route("/products", productsRouter);
openapi.route("/suppliers", suppliersRouter);
openapi.route("/orders", ordersRouter);
openapi.route("/alerts", alertsRouter);

export default app;
