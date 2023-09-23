import mongoose from "mongoose";
import { productModel } from "./models/product.model.js";

class ProductManager {
  //Agrega un nuevo producto
  async addProduct(product) {
    try {
      if (await this.validateCode(product.code)) {
        console.log("Error! Code exists!");
        return false;
      } else {
        const producto = {
          title: product.title,
          description: product.description,
          code: product.code,
          price: product.price,
          status: product.status,
          stock: product.stock,
          category: product.category,
          thumbnail: product.thumbnail,
        };
        const createdProduct = await productModel.create(producto);
        console.log("Product added!");
        return createdProduct;
      }
    } catch (error) {
      console.error("Error adding product:", error);
      return false;
    }
  }
  //Actualiza el producto por su id
  async updateProduct(id, product) {
    try {
      const updatedProduct = await productModel.findByIdAndUpdate(id, product, {
        new: true,
      });
      if (updatedProduct) {
        console.log("Product updated!");
        return true;
      } else {
        console.log("Product not found!");
        return false;
      }
    } catch (error) {
      console.error("Error updating product:", error);
      return false;
    }
  }
  
  //Propiedad utilizada para dar funcionalidad al formulario
  getProductsViews =async ()=>{
    try {
        return await productModel.find().lean();
    } catch (error) {
        return error
    }
  }
  //Burra el producto por su ID
  async deleteProduct(id) {
    try {
      const deletedProduct = await productModel.findByIdAndDelete(id);
      if (deletedProduct) {
        console.log("Product #" + id + " deleted!");
        return true;
      } else {
        console.log("Product not found!");
        return false;
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  }
  
  //Consigue los productos por parametros y hace la paginacion
  async getProducts(params = {}) {
    let { limit = 10, page = 1, query = {}, sort = {} } = params;
    console.log("Query object:", query, "Type:", typeof query);

    sort = sort ? (sort === "asc" ? { price: 1 } : { price: -1 }) : {};

    try {
      let products = await productModel.paginate(query, {
        limit: limit,
        page: page,
        sort: sort,
        lean: true,
      });
      let status = products ? "success" : "error";
      let prevLink = products.hasPrevPage
        ? "http://localhost:8080/products?limit=" +
          limit +
          "&page=" +
          products.prevPage
        : null;
      let nextLink = products.hasNextPage
        ? "http://localhost:8080/products?limit=" +
          limit +
          "&page=" +
          products.nextPage
        : null;

      products = {
        status: status,
        payload: products.docs,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: prevLink,
        nextLink: nextLink,
      };

      console.log(products);
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        status: "error",
        payload: [],
      };
    }
  }
  
  //Consigue el objeto por su ID
  async getProductById(id) {
    try {
      return await productModel.findById(id).lean();
    } catch (error) {
      console.error("Error fetching product by id:", error);
      return null;
    }
  }

  
  async validateCode(code) {
    try {
      return await productModel.exists({ code: code });
    } catch (error) {
      console.error("Error validating code:", error);
      return false;
    }
  }
}

export default ProductManager;
