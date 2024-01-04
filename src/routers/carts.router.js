import { Router } from 'express';
import CartManager from "../dao/classes/cartManagerMongo.js"
import ProductManager from "../dao/classes/productManagerMongo.js"
import { ticketService, cartService } from "../repositories/index.js";
import CartDTO from "../dto/cart.dto.js";
import TicketDTO from "../dto/ticket.dto.js";

const routerC = Router()
const cm = new CartManager()
//const pm = new ProductManager()//

//ENDPOINTS

// ver todos los carritos 
//http://localhost:8080/api/carts

routerC.get("/",async(req,res)=>{
    const carrito=await cm.getCarts()
    res.json({carrito})
 })
 // ver un carrito
 //http://localhost:8080/api/carts/idcart
 routerC.get("/:cid",async(req,res)=>{
   const{cid}=req.params
     const carritofound=await cm.getCartById(cid)
     res.json({status:"success",carritofound})
 })
 
 
 // Crear un carrito

 routerC.post("/", async (req, res) => {
  let { products } = req.body

  let cart = new CartDTO({ products })
  console.log(cart)
  let result = await cartService.createCart(cart)
  console.log(result)
})

 /*routerC.post('/', async (req, res) => {
   try {
       const { obj } = req.body;
 
       if (!Array.isArray(obj)) {
           return res.status(400).send('product debe ser un array');
       }
 
       const validProducts = [];
 
       for (const product of obj) {
           const checkId = await pm.getProductById(product._id);
           if (checkId === null) {
               return res.status(404).send(`Product con id ${product._id} not found`);
           }
           validProducts.push(checkId);
       }
 
       const cart = await cm.addCart(validProducts);
       res.status(200).send(cart);
 
   } catch (err) {
       console.log(err);
       res.status(500).send(' Error del servidor');
   }
 });*/
 
 
 
  // ENDPOINT para compra

  routerC.post("/:cid/purchase", async (req, res) => {
    try {
        let id_cart = req.params.cid;
        const productos = req.body.productos;
        const correo = req.body.correo;
        console.log(correo)
        let cart = cartService.validateCart(id_cart)
        if (!cart) {
            return { error: "No se encontró el carrito con el ID proporcionado" };
        }
        let validaStock = cartService.validateStock({productos})

        if (validaStock) {
            let totalAmount = await cartService.getAmount({productos})
            const ticketFormat = new TicketDTO({amount:totalAmount, purchaser:correo});
            const result = await ticketService.createTicket(ticketFormat);
        } else {
            console.log("No hay suficiente stock para realizar la compra");
        }
    } catch (error) {
        console.error("Error al procesar la compra:", error);
        return res.status(500).json({ error: "Error interno al procesar la compra" });
    }
})

export default routerC
 /*routerC.post("/:cid/products/:pid", async (req, res) => {
     const { cid, pid } = req.params;
     const { quantity } = req.body;
   
     try {
       const checkIdProduct = await pm.getProductById(pid);
       if (!checkIdProduct) {
         return res.status(404).send({ message: `Product with ID: ${pid} not found` });
       }
   
       const checkIdCart = await cm.getCartById(cid);
       if (!checkIdCart) {
         return res.status(404).send({ message: `Cart with ID: ${cid} not found` });
       }
   
       const result = await cm.addProductInCart(cid, { _id: pid, quantity:quantity });
       console.log(result);
       return res.status(200).send({
         message: `Product with ID: ${pid} added to cart with ID: ${cid}`,
         cart: result,
       });
     } catch (error) {
       console.error("Error occurred:", error);
       return res.status(500).send({ message: "An error occurred while processing the request" });
     }
   });


   // actualizar los productos en el carrito
routerC.put('/:cid', async (req, res) => {
  try {
      const { cid } = req.params;
      const { products } = req.body;

      // Verificar si todos los productos existen antes de actualizar el carrito
      for (const product of products) {
          const checkId = await pm.getProductById(product._id);

          if (!checkId) {
              return res.status(404).send({ status: 'error', message: `The ID product: ${product._id} not found` });
          }
      }

      // Verificar si el carrito con el ID cid existe
      const checkIdCart = await cm.getCartById(cid);
      if (!checkIdCart) {
          return res.status(404).send({ status: 'error', message: `The ID cart: ${cid} not found` });
      }

      // Actualizar el carrito en la base de datos con la lista de productos actualizada
      const cart = await cm.updateProductsInCart(cid, products);
      return res.status(200).send({ status: 'success', payload: cart });
  } catch (error) {
      console.log(error);
      return res.status(500).send({ status: 'error', message: 'Ocurrió un error' });
  }
});

// Eliminar un producto de un carrito
routerC.delete('/:cid/product/:pid', async (req, res) => {
  try {
      // Extraer los parámetros de la URL: cid (ID del carrito) y pid (ID del producto)
      const { cid, pid } = req.params;

      // Verificar si el producto con el ID pid existe
      const checkIdProduct = await pm.getProductById(pid);
      if (!checkIdProduct) {
          return res.status(404).send({ status: 'error', message: `Product with ID: ${pid} no encontrado` });
      }

      // Verificar si el carrito con el ID cid existe
      const checkIdCart = await cm.getCartById(cid);
      if (!checkIdCart) {
          return res.status(404).send({ status: 'error', message: `Cart con ID: ${cid} no encontrado` });
      }

      // Buscar el índice del producto en la lista de productos del carrito
      const findProductIndex = checkIdCart.products.findIndex((product) => product._id.toString() === pid);
      if (findProductIndex === -1) {
          return res.status(404).send({ status: 'error', message: `Product con ID: ${pid} no encontrado en cart` });
      }

      // Eliminar el producto de la lista de productos del carrito
      checkIdCart.products.splice(findProductIndex, 1);

      // Actualizar el carrito en la base de datos sin el producto eliminado
      const updatedCart = await cm.deleteProductInCart(cid, checkIdCart.products);

      return res.status(200).send({ status: 'success', message: `Deleted product con ID: ${pid}`, cart: updatedCart });
  } catch (error) {
      console.log(error);
      return res.status(500).send({ status: 'error', message: 'Occurró un error' });
  }
});


   // Eliminar todos los productos de un carrito
   routerC.delete('/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cm.getCartById(cid);
  
      if (!cart) {
        return res.status(404).send({ message: `Cart con  ID: ${cid} no encontrado` });
      }
  
      if (cart.products.length === 0) {
        return res.status(404).send({ message: 'El cart ya esta vacio' });
      }
  
      // Vaciar el carrito estableciendo la propiedad 'products' como un arreglo vacío.
      cart.products = [];
  
      await cm.updateOneProduct(cid, cart.products);
  
      return res.status(200).send({
        status: 'success',
        message: `Cart con ID: ${cid} fue vaciado correctamente`,
        cart: cart,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: 'Ocurrió un error' });
    }
  });

export default routerC*/