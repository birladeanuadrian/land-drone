
export type Base64String = string;

export interface Image {
    timestamp: number;
    buffer: Buffer;
}

export interface EncodedImage {
    ts: number;
    data: Base64String;
}
