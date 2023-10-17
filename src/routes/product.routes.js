import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";
import ProductsServices from "../services/products.service.js";
import productsController from "../controllers/products.controller.js";
import { authorization, passportCall } from "../midsIngreso/passAuth.js";

const productsRouter = Router();
const PM = new ProductManager();
const productService = new ProductsServices();

productsRouter.get("/", productsController.getProducts.bind(productsController));
productsRouter.get(
  "/:pid",
  productsController.getProductById.bind(productsController)
);
productsRouter.post('/', passportCall('jwt'), authorization(['admin']), productsController.addProduct.bind(productsController));
productsRouter.put('/:pid',passportCall('jwt'), authorization(['admin']), productsController.updateProduct.bind(productsController));
productsRouter.delete('/:pid',passportCall('jwt'), authorization(['admin']), productsController.deleteProduct.bind(productsController));

export default productsRouter;