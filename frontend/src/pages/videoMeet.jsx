import React, { useRef, useEffect, useState } from "react";
import "../styles/videoComponent.css";
import { Button, TextField } from "@mui/material";
import { io } from "socket.io-client";



const server_url = "http://localhost:8000";

var connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeetComponent() {
  var socketRef = useRef();
  let socketIdRef = useRef();

  let localVideoRef = useRef();

  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudioAvailable] = useState(true);

  let [video, setVideo] = useState([]);
  let [audio, setAudio] = useState();
  let [screen, setScreen] = useState();

  let [showModal, setModal] = useState();

  let [screenAvailable, setScreenAvailable] = useState();

  let [messages, setMessages] = useState([]);

  let [message, setMessage] = useState("");
  let [newMessage, setNewMessage] = useState(0);
  let [askForUsername, setAskForUsername] = useState(true);
  let [username, setUsername] = useState("");

  const videoRef = useRef([]);
  let [videos, setVideos] = useState([]);

  const getPermission = async () => {
    try {
      // Video permission check
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoPermission) {
        setVideoAvailable(true);
      } else {
        setVideoAvailable(false);
      }

      // Audio permission check
      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      if (audioPermission) {
        setAudioAvailable(true);
      } else {
        setAudioAvailable(false);
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (err) {
      console.error("Permission Error:", err);
    }
  };

  useEffect(() => {
    getPermission();
  }, []);

  let getUserMediaSuccess = (stream) => {
         try {
          window.localStream.getTracks().forEach(track => track.stop())
         }catch (e) {console.log(e)}

         window.localStream = stream;
         localVideoRef.current.srcObject = stream;

         for( let id in connections){
          if( id ==socketIdRef.current) continue;

          connections[id].addStream(window.localStream)

          connections[id].createOffer().then((description)=>{
             connections[id].setLocalDescription(description)
             .then(()=>{
               socketIdRef.current.emit("signal", id, JSON.stringify({"sdp":connections[id].localDescription}))
             })
             .catch(e => console.log(e))
          })
         }
  };

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then((stream) => {
          getUserMediaSuccess(stream); 
        })
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks(); 
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [audio, video]);


let getMessageFromServer = (frontId, message) =>{
      var signal  = JSON.parse(message)

      if(fromId !== socketIdRef.current){
              if(signal.sdp){
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(()=>{
                  if(signal.sdp.type == "offer"){
                    connections[fromId].createAnswer().then((description)=>{
                      connections[fromId].setLocalDescription(description).then(()=>{
                          socketIdRef.current.emit("signal",fromId, JSON.stringify({"sdp":connections[fromId].localDescription}))
                      }).catch(e => console.log(e))
                    }).catch(e => console.log(e))
                  }
                }).catch(e => console.log(e))
              }

              if(signal.ice){
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e =>console.log(e));
              }
      }
}

// to do
let addMessage =()=>{
  
}


  let connectToSocketServer =()=>{

    socketRef.current= io.connect(server_url, {secure: false});

    socketRef.connect.on('signal', getMessageFromServer);

    socketRef.connect.on("connect", ()=>{
    socketRef.current.emit("join-call", window.location.href);
    socketIdRef.current = socketIdRef.current.id;
    socketRef.current.on("chat-message", addMessage)

    socketRef.current.on("user-left", (id)=>{
    // TODO
    setVideo((videos)=>videos.filter((video)=>video.socketId !==id))

  })

     socketRef.current.on("user-joined", (id, clients)=>{
      clients.forEach((socketListId)=>{

        connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

        connections[socketListId].onicecandidate =(event) =>{
          if(event.candidate != null){
            socketRef.current.emit("signal", socketListId, JSON.stringify({'ice':event.candidate}))
          }
        }

        connections[socketListId].onaddstream = (event) =>{
           
             let videoExists = videoRef.current.find(video =>video.socketId == socketListId);

             if(videoExists){
              setVideo(videos => {
                const updatevideos = videos.map(video => 
                       video.socketId == socketListId ? {...video, stream: event.stram} : video
                );

                videoRef.current = updatevideos;
                return updatevideos;
              })


             }else {
                    
                   let newVideo ={
                    socketId: socketListId,
                    stream: event.stream,
                    autoPlay:true,
                    playsinline:true
                   }

                   setVideos(videos =>{
                      const updatevideos = [...videos, newVideo];
                      videoRef.current = updatevideos;
                      return updatevideos;
                   })

             }

        };
         
        if(window.localStream !==undefined && window.localStream !== null){
          connections[socketListId].addStream(window.localStream);
        }else {
          
             

        }



      })
           if(id ===socketId.current){
            for (let id2 in connections){
              if(id2 ===socketIdRef.current) continue
              try {
                    connections[id2].addStream(window.localStream);
              }catch (e) {

              }

              connections[id2].createOffer().then((description)=>{
                     connections[id2].setLocalDescription(description)
                     .then(()=>{
                        socketRef.current.emit('signal', id2, JSON.stringify({"sdp": connections[id2].setLocalDescription}))
                     })
                     .catch (e =>console.log(e))
              })
            }
           }


     })

    })
  }

  let getMedia =()=>{
    setVideo(videoAvailable);
    setAudio(audioAvailable);
   connectToSocketServer();
   
  }

  const connect = () => {
    setAskForUsername(false);
    getMedia();
  };

  return (
    <div>
      {askForUsername === true ? (
        <div>
          <h2>Enter into Lobby</h2>
          <TextField
            id="outlined-basic"
            label="Username"
            value={username}
            variant="outlined"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button variant="contained" onClick={connect}>
            Connect
          </Button>

          <div>
            <video ref={localVideoRef} autoPlay muted></video>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
