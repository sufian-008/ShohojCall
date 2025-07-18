import axios from "axios"
import {createContext, useContext, useState} from "react";
import { useNavigate } from "react-router-dom";
import { StatusCodes } from "http-status-codes";

export  const AuthContext = createContext({});

const  client = axios.create({
     baseURL: "http://localhost:8000/api/v1",
})

export const AuthProvider = ({children}) =>{

    const authContext = useContext(AuthContext);

    const  [userData, setUserData] = useState(authContext);

    const handleRegister =  async (name, username, password) => {
           try{
              
              let request = await client.post("/register", {
                          name: name,
                          username:username,
                          password:password
              })

                 if(request.status === StatusCodes.CREATED){
                      return request.data.message;
                 }

           } catch (err){
                  throw err;  
           }
    }

    const router =useNavigate();



    const data = {
        userData, setUserData, handleRegister
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}