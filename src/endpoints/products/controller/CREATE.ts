import { D1CreateEndpoint, O } from "chanfana";
import { HandleArgs } from "../../../types";
import { ProductModel } from "../../../schemas/schemaProducts";

export class ProductCreate extends D1CreateEndpoint<HandleArgs> {
  _meta = {
    model: ProductModel,
    fields: ProductModel.schema.pick({
      name: true,
      description: true,
      price: true,
      stock: true,
      category: true,
      image: true,
    }),
  };

  before(data: O<typeof this.meta>): Promise<O<typeof this.meta>> {
    data.slug = data.name.toLowerCase().replace(/\s+/g, "-");
    return Promise.resolve(data);
  }
}
