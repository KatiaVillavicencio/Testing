const socket = io()

document.getElementById('email-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('email');
    const email = emailInput.value;
    emailInput.value = '';

    const comInput = document.getElementById('com');
    const comment = comInput.value;
    comInput.value = '';
    console.log(email)
    console.log(comment)

    socket.emit("newEmail",{email:email,comment:comment});

    }
)

socket.on("success", (data) => {
    Swal.fire({
        icon: 'success',
        title: data,
        text: `Correo enviado`,
        confirmButtonText: 'Aceptar', // Cambia el texto del botón Aceptar
    }).then((result) => {
        if (result.isConfirmed) {
            location.reload(); // Recarga la página cuando se hace clic en Aceptar
        }
    });
});

// socket.on("test", data => {
//     console.log(data)
// })
//const socket = io()

//----------------------Enviar------------//
//socket.emit("message", "!Hola, me estoy comunicando desde un websocket!")
//----------------------------------------//
//--------------------Recibir en Consola de Navegador----------//
// socket.on("test", data => {
//     console.log(data)
// })
//---------------------------------------------------------------//