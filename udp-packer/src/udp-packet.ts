const HEADER_DATA_OFFSET = 16;
const REGULAR_DATA_OFFSET = 10;


export class UdpPacket {
    private buffer: Buffer;

    constructor(time: BigInt, page: number, buffer: Buffer) {
        const headerBuffer = Buffer.alloc(10);
        this.buffer = buffer;
    }

    static getHeaderPacketHeaderSize() {
        return HEADER_DATA_OFFSET;
    }

    static getDataPacketHeaderSize() {
        return REGULAR_DATA_OFFSET;
    }

    // static headerPacket(time: BigInt)

    getPage() {
        return 0;
    }

    getTimestamp(): BigInt {
        return 0n;
    }
}
