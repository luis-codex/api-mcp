import { D1ReadEndpoint } from "chanfana";
import { HandleArgs } from "../../../types";
import { OrderModel } from "../../../schemas/schemaOrders";

export class OrderRead extends D1ReadEndpoint<HandleArgs> {
  _meta = { model: OrderModel };
}
