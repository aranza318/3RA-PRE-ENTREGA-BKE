import usersModel from "./models/user.model.js";

class UserManager {
    //Agrega un nuevo usuario
    async addUser(user) {
        try {
            if(user.email == "adminCoder@coder"){
                ures.rol= "admin"
            }
            
            await usersModel.create(user)
            console.log("User added!");
    
            return true;
        } catch (error) {
            return false;
        }
    }
    //Login
    async login(user) {
        try {
            const userLogged =  (await usersModel.findOne({ email: user, password: pass })) || null;
            
            if (userLogged) {
                if (userLogged) {
        const rol =
          userLogged.email === "adminCoder@coder.com" ? "admin" : "usuario";

        req.session.user = {
          id: userLogged._id,
          email: userLogged.email,
          first_name: userLogged.first_name,
          last_name: userLogged.last_name,
          rol: rol,
        };

        console.log(
          "Valor de req.session.user después de la autenticación:",
          req.session.user
        );

        const userToReturn = userLogged;
        console.log("Valor de userToReturn:", JSON.stringify(userToReturn));
        return userToReturn;
      }
      console.log(
        "Valor de userLogged antes de devolver falso:",
        JSON.stringify(userLogged)
      );
      return false;
            }

            return false;
        } catch (error) {
            return false;
        }
    }
    //Consigue el usuario por su email
    async getUserByEmail(user) {
        try {
            const userRegisteredBefore= await usersModel.findOne([{email:user}]) || null;
             if(userRegisteredBefore){
                console.log("Mail registrado anteriormente");
                return user
             }
            
            return true;
        } catch (error) {
            return false;
        }
      
    }
    //Restore Password
    async restorePassword(user, pass) {
        try {
            const userLogged = await usersModel.updateOne({email:user}, {password:pass}) || null;
            
            if (userLogged) {
                console.log("Password Restored!");
                return userLogged;
            }

            return false;
        } catch (error) {
            return false;
        }
    }
    
    //Obtiene el campo solicitado
    async obtenerSegunCampo({campo,valor}) {
        const criterio = {}
        criterio[campo] = valor
        const buscado = await usersModel.findOne(criterio).lean()
        if (!buscado) {
            throw new Error("no encontrado")
        } else {
            return buscado
        }

    }
};
    

export default UserManager;