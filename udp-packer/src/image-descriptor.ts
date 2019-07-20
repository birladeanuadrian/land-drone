
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
