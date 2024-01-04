const socketClient=io()
const nombreUsuario=document.getElementById("username")
const formulario=document.getElementById("formulario")
const inputmensaje=document.getElementById("mensaje")
const chat=document.getElementById("chat")


let usuario=null

if(!usuario){
    Swal.fire({
        title:"Bienvenido al chat",
        text:"Ingresa tu nombre",
        input:"text",
        inputValidator:(value)=>{
            if(!value){
                return "Necesitas ingresar tu Nombre"
            }
        }
    })
    .then(username=>{
        usuario=username.value
        nombreUsuario.innerHTML=usuario
        socketClient.emit("nuevousuario",usuario)
    })
}

formulario.onsubmit=(e)=>{
    e.preventDefault()
    const info={
        user:usuario,
        message:inputmensaje.value
    }
    console.log(info)
    socketClient.emit("mensaje",info)
    inputmensaje.value=" "

}

 socketClient.on("chat",mensaje=>{
   const chatrender=mensaje.map(e=>{
    return `<p><strong>${e.user}</strong>${e.message}`}).join(" ")
   chat.innerHTML=chatrender
   
   
 })

 `Ingreso ${usuario} al chat`

 socketClient.on("broadcast",usuario=>{

   return ({ text:`Ingreso ${usuario} al chat`})
 })