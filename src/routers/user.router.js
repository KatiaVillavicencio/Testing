import { Router } from "express";
//import { Users } from '../dao/factory.js'
import UserDTO from "../dto/user.dto.js";
import { userService } from "../repositories/index.js";
import UserManager  from "../dao/classes/userManagerMongo.js"

const userRouter = Router()

const usersMongo = new UserManager()

userRouter.get("/", async (req, res) => {
    req.logger.info('Se cargan usuarios');
    let result = await usersMongo.get()
    res.send({ status: "success", payload: result })
})

userRouter.post("/", async (req, res) => {
    let { first_name, last_name, email, age, password, rol } = req.body

    let user = new UserDTO({ first_name, last_name, email, age, password, rol })
    let result = await userService.createUser(user)
    if(result){
        req.logger.info('Se crea Usuario correctamente');
    }else{
        req.logger.error("Error al crear Usuario");
    } 
})
userRouter.post("/premium/:uid", async (req, res) => {
    try {
      const { rol } = req.body;
      const uid = req.params.uid;

      let changeRol = await userService.updUserRol({uid, rol});
  
      if (changeRol) {
        req.logger.info('Se actualiza rol correctamente');
        res.status(200).json({ message: 'Rol actualizado correctamente' });
      } else {
        req.logger.error('Error al actualizar el rol');
        res.status(500).json({ error: 'Error al actualizar el rol' });
      }
    } catch (error) {
      console.error('Error en la ruta /premium/:uid:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

export default userRouter