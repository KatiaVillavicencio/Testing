import mongoose from "mongoose";
import config from '../config/config.js'
import dotenv from 'dotenv';

dotenv.config();

export let Carts 
export let Products 
export let Users 
export let Tickets 
switch (config.PERSISTENCE) {
    case "MONGO":
        const connection = mongoose.connect(process.env.URI)
        const { default: CartManagerMongo } = await import('./classes/cartManagerMongo.js')
        const { default: ProductManagerMongo   } = await import('./classes/productManagerMongo.js')
        const { default: UserManagerMongo } = await import('./classes/userManagerMongo.js')
        const { default: TicketManagerMongo } = await import('./classes/ticketManagerMongo.js')
        Carts = CartManagerMongo
        Products = ProductManagerMongo 
        Users = UserManagerMongo 
        Tickets = TicketManagerMongo
        break;
    case "MEMORY":
        const { default: CartsMemory } = await import("./memory/carts.memory.js")
        const { default: ProductsMemory } = await import("./memory/products.memory.js")
        const { default: UsersMemory } = await import("./memory/users.memory.js")
        const { default: TicketsMemory } = await import("./memory/tickets.memory.js")
        Carts = CartsMemory
        Products = ProductsMemory
        Users = UsersMemory
        Tickets = TicketsMemory
        break
    default:

}