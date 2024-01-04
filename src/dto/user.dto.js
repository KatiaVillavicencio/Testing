export default class UserDTO {
    constructor(user) {
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.age = user.age;
        this.email = user.email;
        this.cart = user.cart;
        this.rol = user.rol;

    }
}

