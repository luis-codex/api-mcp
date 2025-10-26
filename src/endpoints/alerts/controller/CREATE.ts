import { D1CreateEndpoint, O } from "chanfana";
import { HandleArgs } from "../../../types";
import { AlertModel } from "../../../schemas/schemaAlerts";

export class AlertCreate extends D1CreateEndpoint<HandleArgs> {
  _meta = {
    model: AlertModel,
    fields: AlertModel.schema
      .pick({
        productId: true,
        type: true,
        severity: true,
        status: true,
        message: true,
        assignedTo: true,
      })
      .partial({
        productId: true,
        assignedTo: true,
      }),
  };

  before(data: O<typeof this.meta>): Promise<O<typeof this.meta>> {
    const now = new Date().toISOString();
    data.triggeredAt = now;
    const status = data.status?.toLowerCase();
    if (status === "resolved") {
      data.resolvedAt = data.triggeredAt;
    } else {
      data.resolvedAt = null;
    }
    return Promise.resolve(data);
  }
}
