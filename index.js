const http = require("http");
const websocketServer = require("websocket").server
const httpServer = http.createServer();

httpServer.listen(9090,()=>console.log("Listening.. on 9090"));
//hashmap client
const clients={};

const wsServer = new websocketServer({
    "httpServer": httpServer
})
wsServer.on("request", request=>{
    //connect
    const connection = request.accept(null, request.origin);
    connection.on("open",()=>console.log("opened!"));
    connection.on("close",()=> console.log("closed!"));
    connection.on("message", message => {
        const result = JSON.parse(message.utf8Data);
        //I have recieve a message from the client
        console.log(result);
    })

    //generate a new clientID GUID
    const clientID = guid();
    clients[clientID] = {
        "connection": connection
    };
    const payLoad = {
        "method": "connect",
        "clientID": clientID
    }
    //send back the client connect
    connection.send(JSON.stringify(payLoad));
})

function S4(){
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}

const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substring(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
