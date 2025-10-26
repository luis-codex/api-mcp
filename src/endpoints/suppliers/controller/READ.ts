import { D1ReadEndpoint } from "chanfana";
import { HandleArgs } from "../../../types";
import { SupplierModel } from "../../../schemas/schemaSuppliers";

export class SupplierRead extends D1ReadEndpoint<HandleArgs> {
  _meta = { model: SupplierModel };
}
