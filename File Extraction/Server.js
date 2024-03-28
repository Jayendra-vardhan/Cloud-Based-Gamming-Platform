const WebSocket = require('ws');

const webSockerServer = new WebSocket.Server({ port: 8080 },);

let clients = {}; // Object to store clients and their states

webSockerServer.on('connection', function connection(ws) {
  const clientId = generateGUID();
  clients[clientId] = { playState: false, timestamp: 0 };

  console.log(`New client connected with ID: ${clientId}`);

  // Send the GUID to the client
  ws.send(JSON.stringify({ clientId }));

  // Send initial state to the client
  ws.send(JSON.stringify(clients[clientId]));

  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);
    const clientId = data.clientId;
    const client = clients[clientId];
    
    if (!client) return;

    if (data.type === 'playState') {
      client.playState = data.value;
    } else if (data.type === 'timestamp') {
      client.timestamp = data.value;
    }

    // Broadcast the updated state to all clients
    webSockerServer.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(clients[clientId]));
      }
    });
  });

  ws.on('close', function() {
    delete clients[clientId];
    console.log(`Client disconnected with ID: ${clientId}`);
  });
});

function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}