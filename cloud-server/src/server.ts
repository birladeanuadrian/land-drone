import * as dgram from 'dgram';
import * as http from 'http';
import * as socketIo from 'socket.io';
import SocketIO from "socket.io";

const udpServer = dgram.createSocket('udp4');
const httpServer = http.createServer();
const io = SocketIO(httpServer);
// io.set('origins', '');

const ioSockets: SocketIO.Socket[] = [];

const registerSocketListener = (socket: SocketIO.Socket) => {
    ioSockets.push(socket);
};

const removeSocketListener = (socket: SocketIO.Socket) => {
    const idx = ioSockets.indexOf(socket);
    if (idx >= 0) {
        ioSockets.splice(idx, 1);
    }
};

const forwardUdpPacket = (buffer: Buffer) => {
    io.emit('packet', buffer);
};

udpServer.on('error', err => {
    console.error('Server error: ' + err);
    udpServer.close();
});

udpServer.on('message', (msg, rinfo) => {
    console.log(`Received message: ${msg.length} from `, rinfo);
    forwardUdpPacket(msg);
});

udpServer.on('listening', () => {
    const address = udpServer.address();
    console.log(`UDP Server listening on`, address);
});

io.on('connection', function(socket){
    console.log('a user connected');
    registerSocketListener(socket);

    socket.on('disconnect', () => {
        console.log('User disconnected');
        removeSocketListener(socket);
    })
});

udpServer.bind(5000);
httpServer.listen(8080);
// io.listen('0.0.0.0', {
//    origins: '*:*'
// });
