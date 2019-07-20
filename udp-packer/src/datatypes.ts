import {UdpPacket} from "./udp-packet";

export interface ImageDescriptor {
    /**
     * 2-byte unsigned int
     */
    imageSize: number;
    /**
     * 2-byte unsigned int
     */
    numberOfPages: number;

    /**
     * 8-byte unsigned bigint
     */
    timestamp: bigint;
}

export interface PacketDescriptor {
    /**
     * 8-byte unsigned bigint
     */
    timestamp: bigint;

    /**
     * 2-byte unsigned int
     */
    page: number;
}

export interface UdpPacketList {
    imageDescriptor?: ImageDescriptor;
    packets: UdpPacket[];
}
