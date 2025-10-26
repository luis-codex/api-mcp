import { D1UpdateEndpoint, O, UpdateFilters } from "chanfana";
import { HandleArgs } from "../../../types";
import { OrderModel } from "../../../schemas/schemaOrders";

export class OrderUpdate extends D1UpdateEndpoint<HandleArgs> {
  _meta = {
    model: OrderModel,
    fields: OrderModel.schema
      .pick({
        productId: true,
        status: true,
        priority: true,
        quantity: true,
        requestedBy: true,
        notes: true,
        expectedArrival: true,
      })
      .partial(),
  };

  before(oldObj: O<typeof this.meta>, filters: UpdateFilters): Promise<UpdateFilters> {
    filters.updatedData ??= {};
    filters.updatedData.updatedAt = new Date().toISOString();
    if (filters.updatedData.notes === undefined && !oldObj.notes) {
      filters.updatedData.notes = "";
    }
    return Promise.resolve(filters);
  }
}
