import mongoose from "mongoose"

const usersCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    /*cart: [
        {
            type:[
        
                {
                    cart:{
                        type:mongoose.Schema.Types.ObjectId,
                        ref: "carts",
                    }
                }
            ]

        },
    ],*/
    rol: String
})

export const usersModel = mongoose.model(usersCollection, userSchema)