const { WebSocket, WebSocketServer } = require('ws');
const DB = require('./database');

function webSocket(httpServer) {
  const socketServer = new WebSocketServer({ server: httpServer });

  socketServer.on('connection', (socket, req) => {
    socket.isAlive = true;
    console.log("connected on websocket");
    // group = DB.getUserByToken(req.cookies['token']).then((user) => user.group);
    // socket.group = group;

    socket.on('message', async (data) => {
      console.log("connected on websocket, message");
      if (data.toString() === 'listUpdate') {
        console.log("Processing a list update");
        // list = await DB.getGroup(socket.group).then((group) => group.list);
        group = await DB.getGroup(socket.group);
        list = group.list;
        socketServer.clients.forEach((client) => {
          if (client !== socket) {
            console.log("sending a message to clients");
            client.send("updateList");
          }
        });
      } else {
        socket.group = data.toString();
      }
    });

    socket.on('pong', () => {
    console.log("connected on websocket: pong");
      console.log(socketServer.clients.size);
      socket.isAlive = true;
    });
  });

  setInterval(() => {
    socketServer.clients.forEach((client) => {
      if (client.isAlive === false) return client.terminate;

      client.isAlive = false;
      client.ping();
    });
  }, 10000);
}

module.exports = { webSocket };
