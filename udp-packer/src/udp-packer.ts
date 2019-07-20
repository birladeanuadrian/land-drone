import {EventEmitter} from "events";
import {UdpPacket} from "./udp-packet";
import {ImageDescriptor} from "./image-descriptor";
import {PacketDescriptor} from "./packet-descriptor";

const MAX_BUFFER_SIZE = 1452;

/**
 * Header buffer contents:
 * 8-byte ubigint le: unix timestamp ms - image unique identifier
 * 2-byte uint le: page number (is 0)
 * 2-byte uint le: number of pages
 * 4-byte uint le: image size
 * up to MAX_BUFFER_SIZE bytes - actual data
 */

/**
 * Data buffer contents:
 * 8-byte ubigint le: unix timestamp ms - image unique identifier
 * 2-byte uint le: page number
 * up to MAX_BUFFER_SIZE bytes - actual data
 */




export class UdpPacker extends EventEmitter {


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

        const initialDataSize = MAX_BUFFER_SIZE - UdpPacket.getHeaderPacketHeaderSize();
        const dataBuffer = jpeg.slice(0, initialDataSize);
        const firstPacket = UdpPacket.headerPacket(imageDescriptor, dataBuffer);
        udpPackets.push(firstPacket);
        // jpeg.copy(firstBuf, HEADER_DATA_OFFSET, 0, initialDataSize);
        let jpegOffset = initialDataSize;
        let page = 1;
        const writeSize = MAX_BUFFER_SIZE - UdpPacket.getDataPacketHeaderSize();

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

    static unpackPackages(packets: UdpPacket[]) {
        return Buffer.concat(packets.map(x => x.getData()));
    }

    public addForUnpack(buf: Buffer) {

    }
}
