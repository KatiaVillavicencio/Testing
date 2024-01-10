import chai from "chai";
import supertest from "supertest";
const { expect, assert } = chai;

import { app } from '../src/app.js';
import { userModel } from "../src/dao/models/users.model.js";
import bcrypt from "bcrypt";
import { Types } from "mongoose";

const requester = supertest(app);

  
describe("Testing Products", () => {

    it("Debe obtener todos los usuarios de la base de datos", async () => {
        const allUsers = await userModel.find();
        console.log(allUsers)

        // verificar la estructura de los datos obtenidos(Chai)
        expect(allUsers).to.be.an("array");
        
    });
    
    it('Debería crear un usuario en la base de datos', async () => {
        // Datos del usuario a crear
        const userData = {
            nombre: "katia",
            apellido: "villavicencio",
            email: "katia@gmail.com",
            password: "password123",
            isGithubAuth: false,
            cartId: new Types.ObjectId(), // Genera un nuevo ID para el carrito
            rol: "user"
        };

        // Crear un nuevo usuario utilizando el modelo
        const createdUser = await userModel.create(userData);

        // Verificar si el usuario se ha creado correctamente
        expect(createdUser).to.exist;
        expect(createdUser.nombre).to.equal("katia");
        expect(createdUser.apellido).to.equal("Villavicencio");
        expect(createdUser.email).to.equal("katia@gmail.com");
        expect(createdUser.password).to.equal("password123");
        expect(createdUser.isGithubAuth).to.equal(false);
        expect(createdUser.cartId).to.exist; // Verifica si se asignó un cartId válido
        expect(createdUser.rol).to.equal("user");
        
    });

    it("Debe actualizar un usuario existente", async () => {
        let userToUpdId = "659723f82a3e5517e8a553d2"; // ID del usuario a actualizar

        const updatedUserData = {
            nombre: "katia",
            apellido: "villavicencio"
        };

        const updatedUser = await userModel.findByIdAndUpdate(userToUpdId, updatedUserData, { new: true });

        // verificar si el resultado es un objeto (Mocha)
        assert.strictEqual(typeof updatedUser, "object");

        expect(updatedUser).to.be.an("object");
        expect(updatedUser.nombre).to.equal("katia");
        expect(updatedUser.apellido).to.equal("villavicencio");
        
    });

    it("Debe eliminar un usuario existente", async () => {
        let userToDltId = "659723f82a3e5517e8a553d2" //Id del usuario que se quire eliminar

        expect(userToDltId).to.be.a("string"); // Verificar que el ID sea un string (chai)


        const deletedUser = await userModel.findByIdAndDelete(userToDltId);

        expect(deletedUser).to.be.an("object");
        // Verificar si la eliminación fue exitosa
    });

});

