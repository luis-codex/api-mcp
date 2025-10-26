import { z } from "zod";

export const order = z.object({
  id: z.number().int(),
  productId: z.number().int(),
  status: z.string(),
  priority: z.string(),
  quantity: z.number().int(),
  requestedBy: z.string(),
  notes: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  expectedArrival: z.string().nullable(),
});

export const OrderModel = {
  tableName: "orders",
  primaryKeys: ["id"],
  schema: order,
  serializerObject: order,
};
