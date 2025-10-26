import { D1DeleteEndpoint } from "chanfana";
import { HandleArgs } from "../../../types";
import { SupplierModel } from "../../../schemas/schemaSuppliers";

export class SupplierDelete extends D1DeleteEndpoint<HandleArgs> {
  _meta = { model: SupplierModel };
}
