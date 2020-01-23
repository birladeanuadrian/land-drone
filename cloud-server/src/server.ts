import * as dgram from 'dgram';
import express from 'express';
import SocketIO from "socket.io";
import cors from 'cors';

const udpServer = dgram.createSocket('udp4');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const server = app.listen(8080, () => {
    console.log('HTTP server running');
});
udpServer.bind(5000);

const io = SocketIO(server, {
    origins: "*:*",
});

udpServer.on('error', err => {
    console.error('Server error: ' + err);
    udpServer.close();
});

udpServer.on('message', (msg, rinfo) => {
    io.emit('packet', msg);
});

udpServer.on('listening', () => {
    const address = udpServer.address();
    console.log(`UDP Server listening on`, address);
});

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    })
});

io.on('control-message', (msg: any) => {
    io.emit('drone-control', msg);
});

app.get('/', (req, res) => {
    res.send('Ok');
});

app.post('/control', (req, res) => {
    const acceleration: number = req.body.acceleration;
    const direction = req.body.direction;

    io.emit('control', JSON.stringify({acceleration, direction}));
    res.json({ok: 1});
});
