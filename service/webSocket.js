const { WebSocket, WebSocketServer } = require('ws');
const DB = require('./database');

function webSocket(httpServer) {
  const socketServer = new WebSocketServer({ server: httpServer });

  socketServer.on('connection', (socket, req) => {
    console.log("connected on websocket");
    socket.isAlive = true;
    console.log("connected on websocket");
    group = DB.getUserByToken(req.cookies['token']).then((user) => user.group);
    console.log("connected on websocket");
    socket.group = group;
    console.log("connected on websocket");

    socket.on('message', () => {
    console.log("connected on websocket");
      list = DB.getGroup(socket.group).then((group) => group.list);
      socketServer.clients.forEach((client) => {
        if (client !== socket && client.group === socket.group) {
          client.send(list);
        }
      });
    });

    socket.on('pong', () => {
    console.log("connected on websocket");
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
