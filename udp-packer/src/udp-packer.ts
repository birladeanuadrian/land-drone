import {UdpPacket} from "./udp-packet";
import {ImageDescriptor, PacketDescriptor, UdpPacketList} from "./datatypes";
import {ImageEmitter} from "./image-emitter";


export class UdpPacker {

    private udpMap: Map<number, UdpPacketList>;
    private imageEmitter: ImageEmitter;

    constructor(imageEmitter: ImageEmitter) {
        this.udpMap = new Map();
        this.imageEmitter = imageEmitter;
    }


    /**
     * Returns an array of udp packets
     * @param jpeg
     */
    static pack(jpeg: Buffer): UdpPacket[] {
        const timestamp = new Date().getTime();
        const udpPackets: UdpPacket[] = [];
        const jpegSize = jpeg.length;

        const imageDescriptor: ImageDescriptor = {
            imageSize: jpegSize,
            numberOfPages: 0,
            timestamp: timestamp
        };

        const initialDataSize = UdpPacket.getMaxBufferSize() - UdpPacket.getHeaderPacketHeaderSize();
        const dataBuffer = jpeg.slice(0, initialDataSize);
        const firstPacket = UdpPacket.headerPacket(imageDescriptor, dataBuffer);
        udpPackets.push(firstPacket);
        let jpegOffset = initialDataSize;
        let page = 1;
        const writeSize = UdpPacket.getMaxBufferSize() - UdpPacket.getDataPacketHeaderSize();

        while (true) {
            let end = jpegOffset + writeSize;
            if (end > jpegSize) {
                end = jpegSize;
            }
            const bufferSize = end - jpegOffset;
            const newBuffer = Buffer.alloc(bufferSize);


            jpeg.copy(newBuffer, 0, jpegOffset, end);
            const udpDescriptor: PacketDescriptor = {page, timestamp};
            const udpPacket = UdpPacket.dataPacket(udpDescriptor, newBuffer);
            page++;
            udpPackets.push(udpPacket);

            if (end == jpegSize) {
                break;
            } else {
                jpegOffset = end;
            }
        }
        firstPacket.setNumberOfPages(page);
        return udpPackets;
    }

    addPacket(packet: UdpPacket) {
        const timestamp = packet.getTimestamp();
        let packetList: UdpPacketList|undefined = this.udpMap.get(timestamp);
        if (packetList) {
            packetList.packets.push(packet);
        } else {
           packetList = {packets: [packet]};

           this.udpMap.set(timestamp, packetList);
        }

        if (!packetList.imageDescriptor && packet.isHeaderPacket()) {
            packetList.imageDescriptor = packet.getImageDescriptor();
        }

        if (packetList.imageDescriptor && packetList.packets.length === packetList.imageDescriptor.numberOfPages) {
            packetList.packets.sort((a, b) => a.getPage() - b.getPage());
            const data = {timestamp: packetList.packets[0].getTimestamp(), buffer: Buffer.concat(packetList.packets.map(x => x.getData()))};
            this.imageEmitter.emit('image', data);
            this.udpMap.delete(timestamp);
        }
    }
}
