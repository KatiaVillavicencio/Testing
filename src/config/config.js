
import dotenv from 'dotenv';

dotenv.config();

export default {
 URI: process.env.URI,
 PORT : process.env.PORT,
 PERSISTENCE: process.env.PERSISTENCE,
 
 PRIVATE_KEY_JWT: process.env.PRIVATE_KEY_JWT,

 ClientID: process.env.CLIENT_ID,
 ClienteSecret: process.env.CLIENT_SECRET,
 CallbackURL: process.env.CALLBACK_URL,
};