const WebSocketServer = require('ws').Server;
const server = new WebSocketServer({ port: 5001 });

server.on('connection', (ws) => {
    for (let i = 0; i < 100; i++)
        ws.send(`This is ${i}`)


    ws.on('message', (message) => {
        console.log("Received: " + message);

        server.clients.forEach(function (client) {
            client.send(message + ' : ' + new Date());
        });
    });

    ws.on('close', () => {
        console.log('I lost a client');
    });
});
