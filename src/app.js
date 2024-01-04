import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from 'cookie-parser';
import passport from 'passport';
import connectToDB from "./config/server.config.js"
import {__dirname, authorization, passportCall} from "./utils.js"
import initializePassword from './config/passport.config.js';
import mongoose from 'mongoose' 
import loggerMiddleware from '../loggerMiddleware.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUIExpress from 'swagger-ui-express'


//routes
import routerP from './routers/products.router.js';
import routerC from './routers/carts.router.js';
import routerV from './routers/views.router.js';
import userRouter from './routers/user.router.js';
import ticketRouter from './routers/tickets.router.js';
import routerL from './routers/logger.router.js';

//socket.io
import socketProducts from "./listeners/socketProducts.js"
import socketChat from './listeners/socketChat.js';
//import socketEmail from './listeners/socketEmail.js';

//Jwt/
//import {generateAndSetToken} from "./config/token.config.js"//
import {generateAndSetToken, generateAndSetTokenEmail, 
    validateTokenResetPass, getEmailFromToken, getEmailFromTokenLogin} from "./config/token.config.js"
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJwt } from 'passport-jwt';

import UserManager from './dao/classes/userManagerMongo.js';
import CartManager from './dao/classes/cartManagerMongo.js';
//DTO
import UserDTO from './dto/user.dto.js';
import ProductManager from './dao/classes/productManagerMongo.js';

const app = express();
const PORT = process.env.PORT || 8080

app.use(express.static(__dirname+"/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(loggerMiddleware);

const httpServer=app.listen(PORT,()=>{
    console.log(`server escuchandoooo en ${PORT}`)
})

//estructura de handlebars
app.engine("handlebars",handlebars.engine())
app.set('view engine', 'handlebars');
app.set("views",__dirname+"/views")

//connect 
connectToDB();

 const users = new UserManager
 const products = new ProductManager

//connect session login//
//app.use (configSession)//
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: process.env.URI,
            mongoOptions:{
            useNewUrlParser: true,
            useUnifiedTopology: true},
            ttl: 15
        }),
        secret: "ClaveSecreta",
        resave: false,
        saveUninitialized: false,
    })
)
/*mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});*/

//JWT//

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.PRIVATE_KEY_JWT,
}

passport.use (
    new JwtStrategy 

(jwtOptions, (jwt_payload, done)=>{
    const user= user.findJWT((user) => user.email===jwt_payload.email)
    if (!user)
    {
        return done (null,false, {message: "Usuario no encontrado"})
}
return done(null,user)
})
)

//Middleware passport
initializePassword();
app.use (passport.initialize());
app.use (passport.session());

//Rutas
app.use('/', routerV); //view
app.use("api/products", routerP)
app.use("api/carts", routerC)
app.use("/users", userRouter)
app.use("/tickets", ticketRouter)
app.use("/loggerTest", routerL) //::::://ruta Logger//::::::
//app.use('/api/sessions',userRouter)//



//socket server
const socketServer = new Server(httpServer)
socketProducts(socketServer)
socketChat(socketServer)
//socketEmail(socketServer)//


//swagger documentacion//
const swaggerOptions = {
    definition:{
        openapi:'3.0.1',
        info:{
            title: 'Documentación de API',
            description:'Documentación realizada con Swagger'
        }
    },
    apis:[`src/docs/users.yaml`,
          `src/docs/products.yaml`,
          `src/docs/tickets.yaml`,
          `src/docs/carts.yaml`]
}
const specs = swaggerJSDoc(swaggerOptions)
app.use("/apidocs", swaggerUIExpress.serve, swaggerUIExpress.setup(specs))


//Front
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const emailToFind = email;
    const user = await users.findEmail({ email: emailToFind });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Error de autenticación" });
    }
    const token = generateAndSetToken(res, email, password);
    const userDTO = new UserDTO(user);
    const prodAll = await products.get()
    res.json({ token, user: userDTO, prodAll});
  });
app.post("/api/register", async(req,res)=>{
    const {first_name, last_name, email,age, password, rol} = req.body
    const emailToFind = email
    const exists = await users.findEmail({ email: emailToFind })
    if(exists) return res.status(400).send({status:"error", error: "Usuario ya existe"})
    const newUser = {
        first_name,
        last_name,
        email,
        age,
        password,
        rol
    };
    users.addUser(newUser)
    const token = generateAndSetToken(res, email, password) 
    res.send({token}) 
})
app.get('/', (req, res) => {
    res.sendFile('html/index.html', { root: app.get('views') });
});
app.get('/register', (req, res) => {
    res.sendFile('html/register.html', { root: app.get('views') });
});
app.get('/current',passportCall('jwt', { session: false }), authorization('user'),(req,res) =>{
    authorization('user')(req, res,async() => {      
        const prodAll = await products.get();
        res.render('home', { products: prodAll });
    });
})
app.get('/admin',passportCall('jwt'), authorization('user'),(req,res) =>{
    authorization('user')(req, res,async() => {    
        const prodAll = await products.get();
        res.render('admin', { products: prodAll });
    });
})


//Recuperar contrasena//
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const emailToFind = email;
    const userExists = await users.findEmail({ email: emailToFind });
    if (!userExists) {
      req.logger.error("Error al reestablecer contraseña usuario "+email+" no existe")
      console.error("Error al reestablecer contraseña usuario "+email+" no existe")
      res.json("Error al reestablecer contraseña usuario "+email+" no existe" );
      return res.status(401).json({ message: "Error al reestablecer contraseña" });
    }
    // Crear y firmar el token JWT con una expiración de 1 hora
    const token = generateAndSetTokenEmail(email)
  
    // Configurar el enlace de restablecimiento de contraseña
    const resetLink = `http://localhost:8080/reset-password?token=${token}`;
  
    let result = transport.sendMail({
        from:'<katiamvv5@gmail.com>',
        to:email,
        subject:'Restablecer contraseña',
        html:`Haz clic en el siguiente enlace para restablecer tu contraseña: <a href="${resetLink}">Restablecer contraseña</a>`,
        attachments:[]
    })
    if(result)
    {
        req.logger.info("Se envia correo para reestablecer contraseña a correo" + emailToFind);
        res.json("Correo para reestablecer contraseña fue enviado correctamente a "+email);
    }
    else
    {
        req.logger.error("Error al enviar correo para reestablecer contraseña");
        console.error("Error al intentar reestablecer contraseña");
        res.json("Error al intentar reestablecer contraseña");
    }
  });
  app.get('/reset-password', async (req, res) => {
    const { token} = req.query;
    const validate = validateTokenResetPass(token)
    const emailToken = getEmailFromToken(token)
    if(validate){
        res.render('resetPassword', { token , email: emailToken});
    }
    else{
        res.sendFile('index.html', { root: app.get('views') });
    }
  });


//mocking//

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
app.get("/mockingproducts", async(req,res)=>{

    const products = [];

    for (let i = 0; i < 50; i++) {
        const product = {
            id: nanoid(),
            description: `Product ${i + 1}`,
            image: 'https://example.com/image.jpg',
            price: getRandomNumber(1, 1000),
            stock: getRandomNumber(1, 100),
            category: `Category ${i % 5 + 1}`,
            availability: 'in_stock'
        };

        products.push(product);
    }

    res.send(products);
})

