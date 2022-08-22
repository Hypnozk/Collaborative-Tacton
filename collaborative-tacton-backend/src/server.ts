import { createServer, IncomingMessage } from 'http';
import { WebSocketServer } from 'ws';
import StoreManager from './store/StoreManager';
import { onMessage, onClose } from './webSocket';
const url = require('url');
var uuid = require('uuid');

const server = createServer();
const wss = new WebSocketServer({ noServer: true });


/**
 * if connection get established successfull, all mesages are handled by onMessage
 * onClose handle the lost of a connection
 */
wss.on('connection', function connection(ws: WebSocket, request: string, client: string) {
    ws.onmessage = (ev) => onMessage(ws, ev.data, client)
    ws.onclose = (ev) => onClose(client);
    
});

/**
 * method, to search for a specific token
 * only if the token is provided by client, an connection will be established
 */
function authenticate(request: IncomingMessage, next: any) {
    if (request.url !== undefined) {
        const current_url = new URL("https:localhost:8080" + request.url)
        const search_params = current_url.searchParams;
        const id = search_params.get('token');
        //console.log(id)
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        if (id === token) {
            next(null, uuid.v1());
        } else {
            next("ERROR Authentification", null);
        }
    } else {
        next("ERROR Authentification", null);
    }
}

/**
 * handle update of the http connection to websocket connection
*/
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