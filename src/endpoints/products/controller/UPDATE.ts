import { D1UpdateEndpoint, O, UpdateFilters } from "chanfana";
import { HandleArgs } from "../../../types";
import { ProductModel } from "../../../schemas/schemaProducts";

export class ProductUpdate extends D1UpdateEndpoint<HandleArgs> {
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

  before(
    oldObj: O<typeof this.meta>,
    filters: UpdateFilters
  ): Promise<UpdateFilters> {
    const newName = filters.updatedData?.name;
    if (typeof newName === "string") {
      const slug = newName.toLowerCase().replace(/\s+/g, "-");
      filters.updatedData.slug = slug;
    }
    return Promise.resolve(filters);
  }
}
