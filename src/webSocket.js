const protocol = window.location.protocol === "http:" ? "ws" : "wss";
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
function sendMessage(data) {
  console.log("sending message and stuff");
  socket.send(data);
}
function setHandler(handler) {
  console.log("setting a handler");
  socket.onmessage = (event) => handler(event);
}

export { sendMessage, setHandler };
