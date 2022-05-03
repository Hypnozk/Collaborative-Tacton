import { createServer, IncomingMessage } from 'http';
import { WebSocketServer } from 'ws';
import StoreManager from './store/StoreManager';
import { onMessage, onClose } from './webSocket';
const url = require('url');
var uuid = require('uuid');

const server = createServer();
const wss = new WebSocketServer({ noServer: true });



wss.on('connection', function connection(ws: any, request: string, client: string) {
    ws.on('message', (data:any) => {
        ws.send('something');
        console.log(ws)
        console.log(typeof ws)
        onMessage(data, client)
    });
    ws.on("close", (data:any) => onClose(data, client));
    
});

function authenticate(request: IncomingMessage, next: any) {
    if (request.url !== undefined) {
        const current_url = new URL("https:localhost:8080" + request.url)
        const search_params = current_url.searchParams;
        const id = search_params.get('token');
        console.log(id)
        if (id === "secure") {
            next(null, uuid.v1());
        } else {
            next("ERROR Authentification", null);
        }
    } else {
        next("ERROR Authentification", null);
    }
}

server.on('upgrade', function upgrade(request, socket, head) {
    // This function is not defined on purpose. Implement it with your own logic.
    //console.log(socket)
    authenticate(request, function next(err: any, client: any) {
        console.log(client)
        console.log(!client)
        if (err || !client) {
            console.log("error")
            socket.write('commandersfaws');
            socket.destroy();
            return;
        }

        wss.handleUpgrade(request, socket, head, function done(ws) {
            
            wss.emit('connection', ws, request, client);
        });
    });
});

server.listen(8080);
console.log("Server startet at port 8080");