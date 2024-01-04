import {usersModel}from "../models/users.model.js"

class UserManager {

    async getAllUsers() {
        try {
            const users = await usersModel.find();
            return { result: "success", payload: users };
        } catch (error) {
            console.error(error);
            return null;
        }
    }   
    async createUser(userData) {
        const { nombre, apellido, email, password } = userData;
        if (!nombre || !apellido || !email || !password) {
            return { status: "error", error: "Missing data" };
        } 
        try {
            const usuario = await usersModel.create({ nombre, apellido, email, password });
            return { message: "User created", user: usuario };
        } catch (error) {
            console.error(error);
            return { status: "error", error: "Error creating user" };
        }
    }

    async getUserById(userId) {
        try {
            const user = await usersModel.findById(userId);
            return user;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async updateUserById(userId, updateFields) {
        try {
            const updatedUser = await usersModel.findByIdAndUpdate(userId, updateFields, { new: true });
            return updatedUser;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async deleteUserById(userId) {
        try {
            await usersModel.findByIdAndDelete(userId);
            return { message: "User deleted" };
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

export default UserManager;