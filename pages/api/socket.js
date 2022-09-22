import { Server } from "socket.io";

const users = {}
const activeSockets = {}
export default function SocketHandler(req, res) {

  if (res.socket.server.io) {
    console.log("Initialized connections");
    res.end();
    return;
  }

  console.log("Initialize Socket Server")
  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const onConnection = (socket) => {
    socket.on('join', (zoomId, tao) => {
      console.log("JON", tao)
      const userId = tao?.id
      console.log(zoomId, userId)
      if (!activeSockets.hasOwnProperty(socket.id)) {
        activeSockets[socket.id] = userId;
      }

      if (!users.hasOwnProperty(userId)) {
        users[userId] = {
          name: tao.name,
          zoomId,
          card: null,
          selected: false,
          sockets: [socket.id]
        }
      } else {
        users[userId].sockets.push(socket.id)
      }

      socket.join(zoomId)
      users[userId].sockets.forEach(sk => {
        io.to(zoomId).emit('notify', Object.keys(users).filter(i=> users[i].zoomId === zoomId).map(i => ({ userId: i, card: users[i]?.card, selected: users[i]?.selected, name: users[i]?.name})))
      })
      console.log("Joined ZoomID", zoomId, socket.id, io.engine.clientsCount)
      io.to(zoomId).emit('update-chat', { src: "system", message: `have joined zoom`, owener: tao.name })
    })

    socket.on('chonbai', (zoomId, userId, cardValue) => {
      console.log("chon bai", zoomId, userId, cardValue)
      users[userId].card = cardValue
      users[userId].selected = true
      io.to(zoomId).emit('notify', Object.keys(users).filter(i=> users[i].zoomId === zoomId).map(i => ({ userId: i, card: users[i]?.card, selected: users[i]?.selected, name: users[i]?.name})))
    })

    socket.on('thongbaolatmat', (zoomId) => {
      io.to(zoomId).emit('tatcalatmat')
      // io.to(zoomId).emit('notify', Object.keys(users).filter(i=> users[i].zoomId === zoomId).map(i => ({ userId: i, card: users[i]?.card, selected: users[i]?.selected})))
    })

    socket.on('thongbaoupmat', (zoomId) => {
      Object.keys(users).filter(i=> users[i].zoomId === zoomId).forEach(i => {
        users[i].card = null
        users[i].selected = false
      })
      io.to(zoomId).emit('tatcaupmat', Object.keys(users).filter(i=> users[i].zoomId === zoomId).map(i => ({ userId: i, card: users[i]?.card, selected: users[i]?.selected, name: users[i]?.name})))
      // io.to(zoomId).emit('notify', Object.keys(users).filter(i=> users[i].zoomId === zoomId).map(i => ({ userId: i, card: users[i]?.card, selected: users[i]?.selected})))
    })

    socket.on('update-user', (name, userId, zoomId) => {
      users[userId].name = name
      io.to(zoomId).emit('notify', Object.keys(users).filter(i=> users[i].zoomId === zoomId).map(i => ({ userId: i, card: users[i]?.card, selected: users[i]?.selected, name: users[i]?.name})))
    })

    socket.on('send-message', (zoomId, message, name) => {
      io.to(zoomId).emit('update-chat', { src: "user", owener: name, message: message })
    })

    socket.on('disconnect', () => {
      console.log("discaonnect", socket.id)
      const userId = activeSockets[socket.id]
      const socketList = users[userId].sockets
      const name = users[userId].name
      socketList.splice(socketList.indexOf(socket.id), 1)
      delete activeSockets[socket.id]

      if (socketList.length === 0) {
        console.log("socketList", socketList.length)
        const zoomId = users[userId].zoomId
        delete users[userId]
        console.log("TIen biet", zoomId, userId)
        io.to(zoomId).emit('update-chat', { src: "system", message: `${name} have left zoom`, owener: name })
        io.to(zoomId).emit('notify', Object.keys(users).filter(i=> users[i].zoomId === zoomId).map(i => ({ userId: i, card: users[i]?.card, name: users[i]?.name})))
      }
    })

  };


  // Define actions inside
  io.on("connection", onConnection);

  console.log("Setting up socket");
  res.end();
}
