const socketClient=io()

socketClient.on("enviodeproducts",(obj)=>{
    updateProductList(obj)
})


function updateProductList(products) {
    let div = document.getElementById("list-products");
    let productos = "";
  
    products.forEach((product) => {
      productos += `
          <article class="container">
        <div class="card">
          <div class="imgBx">
            <img src="${product.thumbnail}" width="150" />
          </div>
          
          <div class="contentBx">
            <h2>Nombre:${product.title}</h2>

            <div class="size">
              <h3>descripcion:${product.description}</h3>
            </div>

            <div class="color">
              <h3>precio: S/. ${product.price}</h3>
            </div>
            <a href="#">Agregar al carrito</a>
          </div>
        </div>
        
      </article>
          
          `;
    });
  
    div.innerHTML = productos;
  }


  let form = document.getElementById("formProduct");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  let title = form.elements.title.value;
  let description = form.elements.description.value;
  let stock = form.elements.stock.value;
  let thumbnail = form.elements.thumbnail.value;
  let category = form.elements.category.value;
  let price = form.elements.price.value;
  let code = form.elements.code.value;

  socketClient.emit("addProduct", {
  title,description, stock, thumbnail,category,price,code, });

  form.reset();
});

document.getElementById("delete-btn").addEventListener("click", function () {
    const deleteidinput = document.getElementById("id-prod");
    const deleteid = deleteidinput.value;
    console.log(deleteid)
    socketClient.emit("deleteProduct", deleteid);
    deleteidinput.value = "";
  });