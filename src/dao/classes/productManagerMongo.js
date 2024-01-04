import { productsModel } from "../models/products.model.js";

class ProductManager {

    async getProducts() {
        try {
            const products = await productsModel.find();
            return products;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async getProductById(id) {
        try {
            
            const product = await productsModel.findOne({ _id: id });
            return product;
        } catch (error) {
            console.log(error);n
            return null;
        }
    }

    async saveProduct(product) {
        try {
          
            const result = await productsModel.create(product);
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async updateProduct(id, product) {
        try {
            
            const result = await productsModel.updateOne({ _id: id }, { $set: product });
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async deleteProduct(id) {
        try {
            
            const result = await productsModel.deleteOne({ _id: id });
            return result;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
export default ProductManager;

