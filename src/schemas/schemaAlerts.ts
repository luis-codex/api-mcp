import { z } from "zod";

export const alert = z.object({
  id: z.number().int(),
  productId: z.number().int().nullable(),
  type: z.string(),
  severity: z.string(),
  status: z.string(),
  message: z.string(),
  triggeredAt: z.string(),
  resolvedAt: z.string().nullable(),
  assignedTo: z.string().nullable(),
});

export const AlertModel = {
  tableName: "alerts",
  primaryKeys: ["id"],
  schema: alert,
  serializerObject: alert,
};
