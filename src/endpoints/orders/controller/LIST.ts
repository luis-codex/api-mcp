import { D1ListEndpoint } from "chanfana";
import { HandleArgs } from "../../../types";
import { OrderModel } from "../../../schemas/schemaOrders";

export class OrderList extends D1ListEndpoint<HandleArgs> {
  _meta = { model: OrderModel };
  searchFields = ["status", "priority", "requestedBy", "notes"];
  defaultOrderBy = "createdAt DESC";
}
