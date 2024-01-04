class CartDTO {
    constructor(cart) {
        this.user = cart.user || null; 
        this.products = cart.products || [];
        this.total = cart.total || 0;
    }
}
  
export default CartDTO;