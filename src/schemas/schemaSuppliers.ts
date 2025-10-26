import { z } from "zod";

export const supplier = z.object({
  id: z.number().int(),
  name: z.string(),
  rut: z.string(),
  phoneNumber: z.string(),
  email: z.string().email(),
  address: z.string(),
});

export const SupplierModel = {
  tableName: "suppliers",
  primaryKeys: ["id"],
  schema: supplier,
  serializerObject: supplier,
};
