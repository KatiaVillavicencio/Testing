
import MessagesManager from "../dao/classes/messageManagerMongo.js";
const messagesManager = new MessagesManager();


const socketChat = (socketServer) => {
    socketServer.on("connection",async(socket)=>{

      socket.on("mensaje", async (info) => {
        // Guardo el mensaje utilizando el MessagesManager
        console.log(info)
        await messagesManager.createMessage(info);
        // Envio el mensaje a todos los usuarios conectados
        socketServer.emit("chat", await messagesManager.getMessages());
        });
      
    
    })
};

export default socketChat;