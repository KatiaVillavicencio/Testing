import {nanoid} from "nanoid"
export default class TicketDTO {
    constructor(ticket) {
        this.code = nanoid()
        this.purchase_datetime = new Date()
        this.amount = ticket.amount
        this.purchaser = ticket.purchaser
    }
}
