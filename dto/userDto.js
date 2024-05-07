module.exports = class UserDto {
    id;
    fullName;
    username;
    role;
    isAuth;

    constructor(model) {
        this.id = model.id
        this.fullName = model.fullName
        this.username = model.username
        this.role = model.role
        this.isAuth = model.isAuth
    }
}