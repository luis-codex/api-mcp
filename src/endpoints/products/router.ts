import { D1DeleteEndpoint, fromHono } from "chanfana";
import { Hono } from "hono";
import { ProductModel } from "../../schemas/schemaProducts";
import { HandleArgs } from "../../types";
import { ProductCreate } from "./controller/CREATE";
import { ProductList, ProductRead, ProductUpdate } from "./controller";

export const productsRouter = fromHono(new Hono());

class ProductDelete extends D1DeleteEndpoint<HandleArgs> {
	_meta = { model: ProductModel };
}

productsRouter.get("/", ProductList);
productsRouter.post("/", ProductCreate);
productsRouter.get("/:id", ProductRead);
productsRouter.put("/:id", ProductUpdate);
productsRouter.delete("/:id", ProductDelete);
