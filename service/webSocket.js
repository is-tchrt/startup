const { WebSocket, WebSocketServer } = require('ws');
const DB = require('./database');

function webSocket(httpServer) {
  const socketServer = new WebSocketServer({ server: httpServer });

  socketServer.on('connection', (socket, req) => {
    console.log("connected on websocket");
    socket.isAlive = true;
    group = DB.getUserByToken(req.cookies['token']).then((user) => user.group);
    socket.group = group;

    socket.on('message', () => {
      socketServer.clients.forEach((client) => {
        if (client.group === socket.group) {
          client.send('getList');
        }
      });
    });

    socket.on('pong', () => {
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
