import {UdpException} from "./udp-exception";
import {ImageDescriptor, PacketDescriptor} from "./datatypes";

const HEADER_DATA_OFFSET = 14;
const REGULAR_DATA_OFFSET = 8;
const MAX_BUFFER_SIZE = 410;


/**
 * Header buffer contents:
 * 4-byte uint le: seconds in unix timestamp  - image unique identifier
 * 2-byte uint le: milliseconds in unix timestamp
 * 2-byte uint le: page number (is 0)
 * 2-byte uint le: number of pages
 * 4-byte uint le: image size
 * up to MAX_BUFFER_SIZE bytes - actual data
 */

/**
 * Data buffer contents:
 * 4-byte uint le: seconds in unix timestamp  - image unique identifier
 * 2-byte uint le: milliseconds in unix timestamp
 * 2-byte uint le: page number
 * up to MAX_BUFFER_SIZE bytes - actual data
 */


export class UdpPacket {
    private readonly buffer: Buffer;

    private constructor(buffer: Buffer) {
        this.buffer = buffer;
    }

    static getHeaderPacketHeaderSize() {
        return HEADER_DATA_OFFSET;
    }

    static getDataPacketHeaderSize() {
        return REGULAR_DATA_OFFSET;
    }

    static getMaxBufferSize() {
        return MAX_BUFFER_SIZE;
    }

    static headerPacket(descriptor: ImageDescriptor, data: Buffer): UdpPacket {
        const headerBuffer = Buffer.alloc(HEADER_DATA_OFFSET);
        const {seconds, ms} = UdpPacket.parseTimestamp(descriptor.timestamp);
        headerBuffer.writeUInt32LE(seconds, 0);
        headerBuffer.writeUInt16LE(ms, 4);
        headerBuffer.writeUInt16LE(0, 6);
        headerBuffer.writeUInt16LE(descriptor.numberOfPages, 8);
        headerBuffer.writeUInt32LE(descriptor.imageSize, 10);
        return new UdpPacket(Buffer.concat([headerBuffer, data]));
    }

    private static parseTimestamp(timestamp: number): {seconds: number, ms: number} {
        const seconds = parseInt(String(timestamp / 1000), 10);
        const ms = Number(timestamp) % 1000;
        return {seconds, ms};
    }

    static dataPacket(descriptor: PacketDescriptor, data: Buffer) {
        const headerBuffer = Buffer.alloc(REGULAR_DATA_OFFSET);
        const {seconds, ms} = UdpPacket.parseTimestamp(descriptor.timestamp);
        headerBuffer.writeUInt32LE(seconds, 0);
        headerBuffer.writeUInt16LE(ms, 4);
        headerBuffer.writeUInt16LE(descriptor.page, 6);
        return new UdpPacket(Buffer.concat([headerBuffer, data]));
    }

    isHeaderPacket() {
        return this.getPage() === 0;
    }

    getImageDescriptor(): ImageDescriptor {
        const pageNumber = this.getPage();
        if (pageNumber !== 0) {
            throw new UdpException('Not a header packet');
        }

        const timestamp = this.getTimestamp();
        const numberOfPages = this.buffer.readUInt16LE(8);
        const imageSize = this.buffer.readUInt32LE(10);

        return {timestamp, numberOfPages, imageSize};
    }

    getTimestamp(): number {
        const seconds = this.buffer.readUInt32LE(0);
        const ms = this.buffer.readUInt16LE(4);
        return seconds * 1000 + ms;
    }

    setNumberOfPages(nr: number) {
        this.buffer.writeUInt16LE(nr, 8);
    }

    getData(): Buffer {
        const pageNr = this.getPage();
        if (pageNr === 0) {
            return this.buffer.slice(HEADER_DATA_OFFSET);
        } else {
            return this.buffer.slice(REGULAR_DATA_OFFSET);
        }
    }

    getPage() {
        return this.buffer.readUInt16LE(6);
    }
}
