import * as dgram from 'dgram';

const DISPATCHER_SERVER = process.env.DISPATCHER_SERVER || 'dispatcher.internal';
const DISPATCHER_PORT = parseInt(process.env.DISPATCHER_PORT || '5000', 10);

const udpReceiver = dgram.createSocket('udp4');
const udpSender = dgram.createSocket('udp4');

udpReceiver.bind(5000);
udpReceiver.on('error', err => {
    console.error('Server error: ' + err);
    udpReceiver.close();
    process.exit(1);
});

udpReceiver.on('message', (msg, rinfo) => {
    udpSender.send(msg, DISPATCHER_PORT, DISPATCHER_SERVER);
});

udpReceiver.on('listening', () => {
    const address = udpReceiver.address();
    console.log(`UDP Server listening on`, address);
    console.log(`Dispatcher server: ${DISPATCHER_SERVER}:${DISPATCHER_PORT}`);
});


