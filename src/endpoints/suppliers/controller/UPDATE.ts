import { D1UpdateEndpoint } from "chanfana";
import { HandleArgs } from "../../../types";
import { SupplierModel } from "../../../schemas/schemaSuppliers";

export class SupplierUpdate extends D1UpdateEndpoint<HandleArgs> {
  _meta = {
    model: SupplierModel,
    fields: SupplierModel.schema.pick({
      name: true,
      rut: true,
      phoneNumber: true,
      email: true,
      address: true,
    }),
  };
}
