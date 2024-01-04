import ProductDTO from "../dto/product.dto.js";

export default class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    getProducts = async () => {
        let result = await this.dao.get()
        return result
    }

    createProduct = async (product) => {
        let prodToInsert = new ProductDTO(product)
        let result = await this.dao.create(prodToInsert)
        return result
    }
}