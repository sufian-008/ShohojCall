import { Server } from "socket.io"


const connectTOSocket =(server) =>{
    const io = new Server(server);
    return io;
}

export default connectTOSocket;