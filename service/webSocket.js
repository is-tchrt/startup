const { WebSocket, WebSocketServer } = require('ws');
const DB = require('./database');

function webSocket(httpServer) {
  const socketServer = new WebSocketServer({ server: httpServer });

  socketServer.on('connection', (socket, req) => {
    socket.isAlive = true;

    socket.on('message', async (data) => {
      if (data.toString() === 'listUpdate') {
        group = await DB.getGroup(socket.group);
        list = group.list;
        socketServer.clients.forEach((client) => {
          if (client !== socket) {
            client.send("updateList");
          }
        });
      } else {
        socket.group = data.toString();
      }
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
