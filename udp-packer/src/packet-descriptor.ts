
export interface PacketDescriptor {
    /**
     * 8-byte unsigned bigint
     */
    timestamp: BigInt;

    /**
     * 2-byte unsigned int
     */
    page: number;
}
