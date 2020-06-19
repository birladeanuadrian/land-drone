import SocketIO from 'socket.io';
import express from 'express';
import cors from 'cors';


const controllerSecret = 'secret1';
const cloudProcessorSecret = 'secret2';
let activeControllers = 0;

const app = express();
app.use(cors({origin: '*'}));
app.use(express.json())
app.use(express.urlencoded());

app.get('/', (req, res) => res.send('Ok'));

app.post('/control', (req, res) => {
    const acceleration: number = req.body.acceleration;
    const direction = req.body.direction;
    ioServer.emit('control', JSON.stringify({acceleration, direction}));
    res.send({ok: 1});
});

const server = app.listen(8080, () => {
    console.log('HTTP server is running');
});

const ioServer = SocketIO(server, {
    origins: '*:*'
});

ioServer.on('connection', (socket: SocketIO.Socket) => {
    let amActive = false;
    console.log('a user connected');

    socket.on('disconnect', () => {
        if (amActive) {
            activeControllers--;
        }
        console.log('a user disconnected');
    });

    socket.on('login', function(secret: string) {
        if (activeControllers) {
            socket.emit('reject-controller');
            return;
        }
        amActive = true;
        activeControllers++;
        if (secret === controllerSecret) {
            console.log('Controller logged in')
            socket.emit('controller-login');

            socket.on('control-message', (msg: any) => {
                console.log('Control message', msg);
                ioServer.emit('drone-control', msg);
            });
        } else if (secret === cloudProcessorSecret) {
            console.log('Cloud processor logged in');

            socket.on('server-frame', function(...args) {
                // console.log('Received frame', args);
                args[0] = args[0].toString('base64');
                // console.log('Emitting tuple');
                ioServer.emit('image', ...args);
            });

        } else {
            socket.disconnect(true);
        }
    });
});

// ioServer.on('control-message', (msg: any) => {
//     ioServer.emit('drone-control', msg);
// });

// ioServer.on('server-frame', (frame: string, ts: number, secret: string) => {
//     console.log('Received frame', secret);
//     if (secret !== serverFrameSecret) {
//         console.log('Invalid secret');
//         return;
//     }
//     imageEmitter.emit('image', ts, frame);
// });

// ioServer.on('server-frame', function(...args: any) {
//     console.log('Received frame', args);
// });

