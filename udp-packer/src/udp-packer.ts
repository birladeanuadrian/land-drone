import {EventEmitter} from "events";
import {UdpPacket} from "./udp-packet";
import {ImageDescriptor, PacketDescriptor, UdpPacketList} from "./datatypes";



export class UdpPacker extends EventEmitter {

    private udpMap: Map<bigint, UdpPacketList>;

    constructor() {
        super();
        this.udpMap = new Map();
    }


    /**
     * Returns an array of udp packets
     * @param jpeg
     */
    static pack(jpeg: Buffer): UdpPacket[] {
        const now = new Date().getTime();
        const timestamp = BigInt(now);
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

    static unpackPackages(packets: UdpPacket[]): Buffer {
        return Buffer.concat(packets.map(x => x.getData()));
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
            this.emit('image', UdpPacker.unpackPackages(packetList.packets));
            this.udpMap.delete(timestamp);
        }
    }
}
