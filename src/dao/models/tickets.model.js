import mongoose from "mongoose";

const ticketsCollection = "tickets";

const ticketSchema = new mongoose.Schema(
  {
    code: { type: String, max: 100, unique: true, required: true },
    purchaser: { type: String, max: 30, required: true },
    amount: { type: Number },
    purchase_datetime: { type: Date, default: Date.now },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }] 
  },
  { timestamps: true } 
);

export const ticketModel = mongoose.model(ticketsCollection, ticketSchema);

