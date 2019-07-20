
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
