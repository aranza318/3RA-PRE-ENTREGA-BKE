export default class UserDto{
    constructor(user){
        this.full_name =  `${user.first_name} ${user.last_name}`
        this.first_name = user.name;
        this.last_name = user.lastname;
        this.email = user.email;
        this.password = user.password;
    }
}