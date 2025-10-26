import { D1DeleteEndpoint, fromHono } from "chanfana";
import { Hono } from "hono";
import { SupplierModel } from "../../schemas/schemaSuppliers";
import { HandleArgs } from "../../types";
import { SupplierCreate } from "./controller/CREATE";
import { SupplierList, SupplierRead, SupplierUpdate } from "./controller";

export const suppliersRouter = fromHono(new Hono());

class SupplierDelete extends D1DeleteEndpoint<HandleArgs> {
  _meta = { model: SupplierModel };
}

suppliersRouter.get("/list", SupplierList);
suppliersRouter.get("/", SupplierList);
suppliersRouter.post("/", SupplierCreate);
suppliersRouter.get("/:id", SupplierRead);
suppliersRouter.put("/:id", SupplierUpdate);
suppliersRouter.delete("/:id", SupplierDelete);
