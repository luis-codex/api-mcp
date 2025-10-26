import { D1DeleteEndpoint, fromHono } from "chanfana";
import { Hono } from "hono";
import { AlertModel } from "../../schemas/schemaAlerts";
import { HandleArgs } from "../../types";
import { AlertCreate } from "./controller/CREATE";
import { AlertList, AlertRead, AlertUpdate } from "./controller";

export const alertsRouter = fromHono(new Hono());

class AlertDelete extends D1DeleteEndpoint<HandleArgs> {
  _meta = { model: AlertModel };
}

alertsRouter.get("/", AlertList);
alertsRouter.post("/", AlertCreate);
alertsRouter.get("/:id", AlertRead);
alertsRouter.put("/:id", AlertUpdate);
alertsRouter.delete("/:id", AlertDelete);
