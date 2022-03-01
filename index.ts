const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});
const port = process.env.PORT || 4000;
const { v4: uuidv4 } = require('uuid');
import { IParticipant } from './interfaces/participant'

app.use(cors());
app.use(express.static('public'))
app.get('/', (req: any, res: any) => {
  res.send({ meetingId: uuidv4() });
});

app.get('/:meetingId', (req: any, res: any) => {
  const response = meetingData[req.params.meetingId] ? { meetingData: meetingData[req.params.meetingId] } : { meetingData: null }
  res.send(response)
});

let counter = 0;
const hostName = 'Host';
const participantName = 'Participant';
const users = new Map();

const meetingData: Record<string, IParticipant[]> = {};

class Connection {
  private socket;
  private io;
  constructor(io: any, socket: any) {
    this.socket = socket;
    this.io = io;

    socket.on('getUsers', (roomId :string) => this.getUsers(roomId));
    socket.on('timer', (roomId :string , counter:number) => this.startTimer(roomId,counter));
    socket.on('userJoined', (user: any, roomId: string) => this.addUser(user, roomId))
    socket.on('muteAll', (roomId:any) => this.muteAll(roomId));
    socket.on('disconnect', () => this.disconnect());
    socket.on('connect_error', (err: any) => {
      console.log(`connect_error due to ${err.message}`);
    });
  }

  startTimer(roomId: string, counter: number) {

    // If all the persons in the room  except server want to receive see timer
    // this.socket.broadcast.to(roomId).emit('startTimer', counter);

    // If all the persons in the room want to receive counter
    this.io.to(roomId).emit('startTimer', counter);
  }
  getUsers(roomId: any) {
    if(meetingData[roomId])
      meetingData[roomId].forEach((user) => this.sendUser(user,roomId));
  }

  sendUser(user: any,roomId:any) {
    // To send message to all sockkets in the room except the current socket
    // this.socket.broadcast.to(roomId).emit('user', user);
    // this.io.sockets.emit('user', user);
    // To send message to all sockets in the room 
    this.io.to(roomId).emit('user', user);
  }

  muteAll(roomId:any){
    this.socket.broadcast.to(roomId).emit('muteClient');
  }


  disconnect() {
    if(users.get(this.socket)){
      const userId = users.get(this.socket).userId;
      const roomId = users.get(this.socket).roomId;
      if(users.get(this.socket).isHost){
        this.socket.broadcast.to(roomId).emit('hostdisconnected');
        delete meetingData[roomId];
      }
      this.deleteUserFromRoom(userId, roomId);
      users.delete(this.socket);
      
    }
  }


  deleteUserFromRoom(userId: any, roomId: any) {
    if(meetingData[roomId]){
      meetingData[roomId] = meetingData[roomId].filter((user) => user.userId !== userId);
      // this.socket.broadcast.to(roomId).emit('deleteUser', userId);
      // this.io.sockets.emit('deleteUser', userId);
      this.io.to(roomId).emit('deleteUser', userId);
    }


  }
  addUser(user: any, roomId: string) {
    this.socket.join(roomId);
    let userObject;
    if (!meetingData[roomId] || (meetingData[roomId] && !meetingData[roomId].length)) {
      meetingData[roomId] = [];
      userObject =
      {
        roomId,
        userId: user.userId,
        name: hostName,
        isHost: true
      }

    } else {
      userObject =
      {
        roomId,
        userId: user.userId,
        name: participantName + ' ' + counter,
        isHost: false
      }
      counter++;
    }
    meetingData[roomId].push(userObject);
    users.set(this.socket, userObject);
  }
}

io.on('connection', (socket: any) => {
  new Connection(io, socket);
});


server.listen(port, () => {
  console.log("Server running on port : " + port);
})



