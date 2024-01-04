const socketEmail = (socketServer, products, transport) => {
    socketServer.on("connection", socket => {
        console.log("Socket Conectado");

        // Recibir información del cliente
        socket.on("message", data => {
            console.log(data);
        });

        socket.on("newProd", (newProduct) => {
            products.addProduct(newProduct);
            socketServer.emit("success", "Producto Agregado Correctamente");
        });

        socket.on("updProd", ({ id, newProduct }) => {
            products.updateProduct(id, newProduct);
            socketServer.emit("success", "Producto Actualizado Correctamente");
        });

        socket.on("delProd", (id) => {
            products.deleteProduct(id);
            socketServer.emit("success", "Producto Eliminado Correctamente");
        });

        socket.on("newEmail", async ({ email, comment }) => {
            try {
            let result = await transport.sendMail({
                from: 'Chat Correo <katiamvv5@gmail.com>',
                to: email,
                subject: 'Correo de prueba',
                html: `
                    <div>
                        <h1>${comment}</h1>
                    </div>
                `,
                attachments: []
            });
            socketServer.emit("success", "Correo enviado correctamente");

        } catch (error){
            console.error("Error al enviar el correo:", error.message);
        }
        });

        // Enviar información al cliente
        socket.emit("test", "mensaje desde servidor a cliente, se valida en consola de navegador");
    });
};

export default socketEmail;
