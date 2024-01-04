import { Router } from "express";
import TicketDTO from "../dto/ticket.dto.js";
import { ticketService } from "../repositories/index.js";
import Tickets from "../dao/classes/ticketManagerMongo.js"

const ticketRouter = Router()

const ticketMongo = new Tickets()

ticketRouter.get("/", async (req, res) => {
    let result = await ticketMongo.get()
    res.send({ status: "success", payload: result })
})

ticketRouter.post("/", async (req, res) => {
    let { amount, purchaser } = req.body
    let tick = new TicketDTO({ amount, purchaser })
    let result = await ticketService.createTicket(tick)
})

export default ticketRouter