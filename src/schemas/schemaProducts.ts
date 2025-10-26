import { z } from "zod";

export const product = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  price: z.number(),
  stock: z.number(),
  category: z.string(),
  image: z.string(),
});

export const ProductModel = {
  tableName: "products",
  primaryKeys: ["id"],
  schema: product,
  serializerObject: product,
};
