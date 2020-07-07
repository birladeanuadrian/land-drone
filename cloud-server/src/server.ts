import SocketIO, {Socket} from 'socket.io';
import express from 'express';
import cors from 'cors';
import * as http from 'http';
import * as fs from 'fs';


const controllerSecret = 'secret1';
const cloudProcessorSecret = 'secret2';
let activeControllers = 0;

const allowedVideoFilenames = [
    "D:\\Work\\git\\LandDrone\\cloud2\\outpy.avi",
    '/srv/image-processor/outpy.avi'
];

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

app.get('/download-video', (req, res) => {
    let fileFound = false;
    for (let filename of allowedVideoFilenames) {
        if (fs.existsSync(filename)) {
            fileFound = true;
            res.download(filename, 'recording.avi');
        }
    }

    if (!fileFound) {
        res.status(404).send('Video recording not found');
    }
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
            stopRecording(socket);
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

    socket.on('start-rec', () => {
        console.log('start recording');
        http.get('http://localhost:3000/start-record', res => {
            res.on('error', err => {
                console.error('Error', err);
            });
            console.log('Response', res.statusCode, res.read());
        });
    });

    socket.on('stop-rec', () => {
        stopRecording(socket);
    });

    socket.on('start-track', () => {
        console.log('start track');
        http.get('http://localhost:3000/start-tracking', res => {
            res.on('error', err => {
                console.error('Error', err);
            });
            console.log('Response', res.statusCode, res.read());
        });
    });

    socket.on('stop-track', () => {
        console.log('stop track');
        http.get('http://localhost:3000/stop-tracking', res => {
            res.on('error', err => {
                console.error('Error', err);
            });
            console.log('Response', res.statusCode, res.read());
        })
    });
});

function stopRecording(socket: Socket) {
    console.log('stop recording');
    const request = http.get('http://localhost:3000/stop-record', res => {
        console.log('Response', res.statusCode, res.read());
    });
    request.on('error', err => {
        console.error('Error encountered', err);
    });
}
