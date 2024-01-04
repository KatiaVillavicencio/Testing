import { ticketModel } from "../models/tickets.model.js"

export default class Tickets {
    constructor() {

    }

    get = async () => {
        let tickets = await ticketModel.find()
        return tickets
    }
    addTicket = async (newticket) => {
        try {
            let result = await ticketModel.create(newticket);
            return result;
        
        } catch (error) {
            console.error("Error al crearticket:", error);
            return "error";
        }
    }
}