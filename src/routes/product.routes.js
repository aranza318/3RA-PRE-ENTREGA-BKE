import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";
import { socketServer } from "../../app.js";

const productsRouter = Router();
const PM = new ProductManager();

//Consigue los productos
productsRouter.get("/", async (req, res) => {
  try {
    let queryObj = {};
    if (req.query.query) {
      try {
        queryObj = JSON.parse(req.query.query);
      } catch (err) {
        return res.status(400).send({ status: "error", message: "Invalid query format." });
      }
    }

    const params = {
      ...req.query,
      query: queryObj,
    };

    const products = await PM.getProducts(params);
    res.send(products);
  } catch (error) {
    res
      .status(500)
      .send({ status: "error", message: "Error fetching products." });
    console.log(error);
  }
});

//Encuentra el producto por su ID
productsRouter.get("/:pid", async (req, res) => {
  console.log("Accessing product detail route...");
  try {
    const pid = req.params.pid;
    console.log("Product ID:", pid);
    const product = await PM.getProductById(pid);
    if (product) {
      console.log("Found product, rendering...");
      res.render("productDetail", { product });
    } else {
      console.log("Product not found!");
      res.status(404).send({ status: "error", message: "Product not found." });
    }
  } catch (error) {
    console.error("Error fetching product by id:", error);
    res
      .status(500)
      .send({ status: "error", message: "Error fetching product by id." });
  }
});

//Postea un nuevo producto
productsRouter.post("/", async (req, res) => {
  let { title, description, code, price, status, stock, category, thumbnail } = req.body;
  console.log("Received thumbnail:", thumbnail);

  if (!title) {
    res.status(400).send({ status: "error", message: "Error! No se cargó el campo Title!" });
    return false;
  }

  if (!description) {
    res.status(400).send({ status: "error", message: "Error! No se cargó el campo Description!"});
    return false;
  }

  if (!code) {
    res.status(400).send({ status: "error", message: "Error! No se cargó el campo Code!" });
    return false;
  }

  if (!price) {
    res.status(400).send({ status: "error", message: "Error! No se cargó el campo Price!" });
    return false;
  }

  status = !status && true;

  if (!stock) {
    res.status(400).send({ status: "error", message: "Error! No se cargó el campo Stock!" });
    return false;
  }

  if (!category) {
    res.status(400).send({status: "error",message: "Error! No se cargó el campo Category!"});
    return false;
  }

  if (!thumbnail) {
    res.status(400).send({status: "error",message: "Error! No se cargó el campo Thumbnail!",});
    return false;
  }
  try {
    const wasAdded = await PM.addProduct({title,description,code,price,status,stock,category,thumbnail});

    if (wasAdded && wasAdded._id) {
      res.send({status: "ok",message: "El Producto se agregó correctamente!"});
      socketServer.emit("product_created", { _id: wasAdded._id,title,description,code,price,status,stock,category,thumbnail});
    } else {
      res.status(500).send({status: "error", message: "Error! No se pudo agregar el Producto!"});
    }
  } catch (error) {
    res.status(500).send({ status: "error", message: "Internal server error." });
  }
});

//Modifica un objeto por su ID
productsRouter.put("/:pid", async (req, res) => {
  let { title, description, code, price, status, stock, category, thumbnail } = req.body;

  try {
    const pid = req.params.pid;
    const wasUpdated = await PM.updateProduct(pid, {title,description,code,price,status,stock,category,thumbnail});
    if (wasUpdated) {
      res.send({status: "ok",message: "El Producto se actualizó correctamente!"});
      socketServer.emit("product_updated");
    } else {
      res.status(500).send({status: "error",message: "Error! No se pudo actualizar el Producto!"});
    }
  } catch (error) {
    res.status(500).send({ status: "error", message: "Internal server error." });
  }
});

//Borra un producto
productsRouter.delete("/:pid", async (req, res) => {
  let pid = req.params.pid;

  const wasDeleted = await PM.deleteProduct(pid);

  if (wasDeleted) {
    res.send({status: "ok",message: "El Producto se eliminó correctamente!"});
    socketServer.emit("product_deleted", { _id: pid });
  } else {
    res.status(500).send({status: "error",message: "Error! No se pudo eliminar el Producto!"});
  }
});

export default productsRouter;
