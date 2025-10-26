import { D1CreateEndpoint } from "chanfana";
import { HandleArgs } from "../../../types";
import { SupplierModel } from "../../../schemas/schemaSuppliers";

export class SupplierCreate extends D1CreateEndpoint<HandleArgs> {
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
