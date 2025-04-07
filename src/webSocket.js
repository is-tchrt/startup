const protocol = window.location.protocol === "http:" ? "ws" : "wss";
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
function sendMessage(data) {
  socket.send(data);
}
function setHandler(handler) {
  socket.onmessage = (event) => handler(event);
}

export { sendMessage, setHandler };
