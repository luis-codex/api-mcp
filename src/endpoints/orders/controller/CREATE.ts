import { D1CreateEndpoint, O } from "chanfana";
import { HandleArgs } from "../../../types";
import { OrderModel } from "../../../schemas/schemaOrders";

export class OrderCreate extends D1CreateEndpoint<HandleArgs> {
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
      .partial({
        notes: true,
        expectedArrival: true,
      }),
  };

  before(data: O<typeof this.meta>): Promise<O<typeof this.meta>> {
    const now = new Date().toISOString();
    data.createdAt = now;
    data.updatedAt = now;
    data.notes ??= "";
    if (data.expectedArrival === undefined) {
      data.expectedArrival = null;
    }
    return Promise.resolve(data);
  }
}
