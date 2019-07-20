import {ImageDescriptor} from "./image-descriptor";
import {PacketDescriptor} from "./packet-descriptor";
import {UdpException} from "./udp-exception";

const HEADER_DATA_OFFSET = 16;
const REGULAR_DATA_OFFSET = 10;


export class UdpPacket {
    private buffer: Buffer;

    private constructor(buffer: Buffer) {
        this.buffer = buffer;
    }

    static getHeaderPacketHeaderSize() {
        return HEADER_DATA_OFFSET;
    }

    static getDataPacketHeaderSize() {
        return REGULAR_DATA_OFFSET;
    }

    static headerPacket(descriptor: ImageDescriptor, data: Buffer): UdpPacket {
        const headerBuffer = Buffer.alloc(HEADER_DATA_OFFSET);
        headerBuffer.writeBigUInt64LE(descriptor.timestamp, 0);
        headerBuffer.writeUInt16LE(0, 8);
        headerBuffer.writeUInt16LE(descriptor.numberOfPages, 10);
        headerBuffer.writeUInt32LE(descriptor.imageSize, 12);
        return new UdpPacket(Buffer.concat([headerBuffer, data]));
    }

    static dataPacket(descriptor: PacketDescriptor, data: Buffer) {
        const headerBuffer = Buffer.alloc(REGULAR_DATA_OFFSET);
        headerBuffer.writeBigUInt64LE(descriptor.timestamp);
        headerBuffer.writeUInt16LE(descriptor.page, 8);
        return new UdpPacket(Buffer.concat([headerBuffer, data]));
    }

    getImageDescriptor(): ImageDescriptor {
        const pageNumber = this.getPage();
        if (pageNumber !== 0) {
            throw new UdpException('Not a header packet');
        }

        const timestamp = this.buffer.readBigUInt64LE(0);
        const numberOfPages = this.buffer.readUInt16LE(10);
        const imageSize = this.buffer.readUInt32LE(12);

        return {timestamp, numberOfPages, imageSize};
    }

    setNumberOfPages(nr: number) {
        this.buffer.writeUInt16LE(nr, 10);
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
        return this.buffer.readUInt16LE(8);
    }
}
