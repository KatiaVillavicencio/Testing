import { Router } from 'express';
import ProductDTO from "../dto/product.dto.js";
import { productService } from "../repositories/index.js";
import ProductManager from '../dao/classes/productManagerMongo.js';
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateProductErrorInfo } from "../services/errors/info.js";

const routerP = Router()

const productMongo = new ProductManager()

routerP.get("/", async (req, res) => {
    req.logger.info('Se cargan productos');
    let result = await productMongo.get()
    res.send({ status: "success", payload: result })
})

// http://localhost:8080/products//


routerP.post("/", async (req, res) => {
    let { description, image, price, stock, category, availability, owner } = req.body
    if(owner === undefined || owner == '')
    {
        owner = 'admin@admin.com'
    }
    const product = { description, image, price, stock, category, availability, owner}
    if (!description || !price) {
        try {
            //  throw an error
            throw CustomError.createError({
                name: 'Error en Creacion de Producto',
                cause: generateProductErrorInfo(product),
                message: 'Error al intentar crear el Producto',
                code: EErrors.REQUIRED_DATA,
            });
            req.logger.info('Se crea producto correctamente');
        } catch (error) {
            req.logger.error("Error al comparar contraseñas: " + error.message);
            console.error(error);
        }
    }
    let prod = new ProductDTO({ description, image, price, stock, category, availability, owner })
    let userPremium = await userService.getRolUser(owner)
    if(userPremium == 'premium'){
        let result = await productService.createProduct(prod)
    }else{
        req.logger.error("Error al ingresar owner de usuario invalido");
    }
    
})

export default routerP

//ENDPOINTS

//http://localhost:8080/api/products/?limit=1
//http://localhost:8080/api/products/?sort=1
//http://localhost:8080/api/products/?page=1
//http://localhost:8080/api/products/?category=hogar

/*routerP.get('/', async (req, res) => {
    try {
        let { limit, page, sort, category } = req.query
        console.log(req.originalUrl);
        console.log(req.originalUrl.includes('page'));
  
        const options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: { price: Number(sort) }
  
        };
  
    //desc --> -1 / asc --> 1
  
        if (!(options.sort.price === -1 || options.sort.price === 1)) {
             options.sort = {}
        }
  
  
        const links = (products) => {
            let prevLink;
            let nextLink;
            if (req.originalUrl.includes('page')) {
                  // Si la URL original contiene el parámetro 'page', entonces:
  
                prevLink = products.hasPrevPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.prevPage}`) : null;
                nextLink = products.hasNextPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.nextPage}`) : null;
                return { prevLink, nextLink };
            }
        
            return { prevLink, nextLink };
  
        }
  
        // Devuelve un array con las categorias disponibles y compara con la query "category"
        const categories = await pm.categories()
  
        const result = categories.some(categ => categ === category)
        if (result) {
  
            const products = await pm.getProducts({ category }, options);
            const { prevLink, nextLink } = links(products);
            const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products
            return res.status(200).send({ status: 'success', payload: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink });
        }
  
        const products = await pm.getProducts({}, options);
        // console.log(products, 'Product');
        const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products
        const { prevLink, nextLink } = links(products);
        return res.status(200).send({ status: 'success', payload: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink });
    } catch (err) {
        console.log(err);
    }
  
  
  })
  
    routerP.get("/:pid", async (req, res) => {
      const {pid}=req.params
      const productfind = await pm.getProductById(pid);
      res.json({ status: "success", productfind });
    });
  
    routerP.post("/", async (req, res) => {
      let { description, image, price, stock, category, availability } = req.body
      let prod = new ProductDTO({ description, image, price, stock, category, availability })
      let result = await productService.createProduct(prod)
  })
  
    routerP.put("/:pid", async (req, res) => {
      const {pid}=req.params
      const obj=req.body
      const updatedproduct = await pm.updateProduct(pid,obj);
      console.log(updatedproduct)
       res.json({ status: "success", updatedproduct });
    });
   
    
    routerP.delete("/:pid", async (req, res) => {
      const id=req.params.pid
      const deleteproduct = await pm.deleteProduct(id);
       res.json({ status: "success",deleteproduct });
    });
  
    
  export default routerP*/