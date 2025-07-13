import { Server } from "socket.io"

let connections = {}
let message ={}
let timeOnline ={}

const connectTOSocket =(server) =>{
    const io = new Server(server);

    io.on("connection", (socket)=>{
        socket.on("join-call", (path)=>{
              
            if(connections[path]=== undefined){
                  connections[path]=[];
            }
            connections[path].push(socket.id)
            
            timeOnline[socket.id]= new Date();

             

            for(let a=0; a<connections[path].length; a++){
                io.to(connections[path][a]).emit("user-joined", socket.id, connections[path]);
            }
 
            if(message[path] !== undefined){
                for(let a = 0; a < message[path].length; a++){
                    io.to(socket.id).emit("chat-message", message[path][a]["data"], message[path][a]["sender"], message[path][a]['socket-id-sender'])
                }
            }

             
 
        });
        socket.on("signal", (toId, message)=>{
            io.to(toId).emit("signal", socket.id, message);
        })

        socket.on("chat-message",(data, sender)=>{

            const [matchingRoom, found] = Object.entries(connections)
            .reduce(([room, isFound], [roomKey, roomValue])=>{
                 if(!isFound &&  roomValue.includes(socket.id)){
                    return [roomKey, true];
                 }
                 return [room, isFound];
            }, ['',false]);

            if(found == true){
                if(message[matchingRoom]==undefined){
                    message[matchingRoom] = [];
                }

                message[matchingRoom].push({'sender':sender, "data": data, "socket-id-sender":socket.id});
                console.log("message", key ,":", sender, data);

                connections[matchingRoom].forEach(element => {
                       io.to(element).emit("Chat-message", data, sender, socket.id);
                });
            }
        })

        socket.on("disconnect",()=>{
             var diffTime =Math.abs(timeOnline[socket.id] - new Date());
        })
    })
    return io;
}

export default connectTOSocket;