const websocketServer = require("websocket").server
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log("Listening.. on 9090"))
const wsServer = new websocketServer({
  "httpServer": httpServer
})
// Object to store clients and their states
let clients = {};
let connStrings = {};

wsServer.on('request', request => {
//connect
const conn = request.accept(null, request.origin);
    conn.on("open", () => console.log("opened!"));
    conn.on("close", () => {
      delete clients[clientId];
      console.log(`Client disconnected with ID: ${clientId}`);
    });
    conn.on("message",message =>{
      //received a message from the client
      const result = JSON.parse(message.utf8Data)
      //want to create a new connection point
      if (result.method === "create") {
        const clientId = result.clientId;
        const conn = guid();
        connStrings[conn] = {
          "playState": false,
          "timestamp": 0
        }
        
        const payload = {
          "method": "create",
          "conn": connStrings[conn]
        };
        const con = clients[clientId].connection;
        con.send(JSON.stringify(payload));
      }
      if (result.method === "join") {
        const clientId = result.clientId;
        const gameId
      }

    })

// console.log(`New client connected with ID: ${clientId}`);

//  ws.on('request', request.accept(message) {
//     const data = JSON.parse(message);
//     const clientId = data.clientId;
//     const client = clients[clientId];
    
//     if (!client) return;

//     if (data.type === 'playState') {
//       client.playState = data.value;
//     } else if (data.type === 'timestamp') {
//       client.timestamp = data.value;
//     }

    // // Broadcast the updated state to all clients
    // clients.forEach((client) => {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(JSON.stringify(clients[clientId]));
    //   }
    // });
  //});
});

function S4() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}

// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substring(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
