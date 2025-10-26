import { D1UpdateEndpoint, O, UpdateFilters } from "chanfana";
import { HandleArgs } from "../../../types";
import { AlertModel } from "../../../schemas/schemaAlerts";

export class AlertUpdate extends D1UpdateEndpoint<HandleArgs> {
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
      .partial(),
  };

  before(oldObj: O<typeof this.meta>, filters: UpdateFilters): Promise<UpdateFilters> {
    filters.updatedData ??= {};
    const hasStatusUpdate = typeof filters.updatedData.status === "string";
    const status = (filters.updatedData.status ?? oldObj.status)?.toLowerCase();
    if (hasStatusUpdate) {
      if (status === "resolved") {
        filters.updatedData.resolvedAt = new Date().toISOString();
      } else {
        filters.updatedData.resolvedAt = null;
      }
    }
    return Promise.resolve(filters);
  }
}
