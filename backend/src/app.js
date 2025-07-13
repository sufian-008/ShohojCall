import express from "express";
import {createServer} from "node:http";

import connectTOSocket from "./controller/socketManger.js";
import userRoutes from "./routes/users.routes.js"

import mongoose from "mongoose";

import cors from "cors";

const app =express();
const server = createServer(app);
const io = connectTOSocket(server);

app.set("port", (process.env.PORT || 8000));
app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limi:"40k", extended:true}));
app.use("/api/v1/users", userRoutes);


app.get("/home", (req, res)=>{
    return res.json({"hello": "World"})
});

const start = async () =>{
    const connectionDB = await mongoose.connect("mongodb+srv://mdrafin008:YaXZsF9jjkNU0rz4@cluster0.to0zdej.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log(`MONGO connected DB Host:${connectionDB.connection.host}`);
    server.listen(app.get("port"), ()=>{
         console.log("listening");
    })
}

start();