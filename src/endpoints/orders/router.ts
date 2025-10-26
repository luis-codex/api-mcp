import { D1DeleteEndpoint, fromHono } from "chanfana";
import { Hono } from "hono";
import { OrderModel } from "../../schemas/schemaOrders";
import { HandleArgs } from "../../types";
import { OrderCreate } from "./controller/CREATE";
import { OrderList, OrderRead, OrderUpdate } from "./controller";

export const ordersRouter = fromHono(new Hono());

class OrderDelete extends D1DeleteEndpoint<HandleArgs> {
  _meta = { model: OrderModel };
}

ordersRouter.get("/", OrderList);
ordersRouter.post("/", OrderCreate);
ordersRouter.get("/:id", OrderRead);
ordersRouter.put("/:id", OrderUpdate);
ordersRouter.delete("/:id", OrderDelete);
