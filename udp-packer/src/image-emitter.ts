
export interface ImageEmitter {
    on(type: 'image', func: (data: {timestamp: number, buffer: Buffer}) => any): any;
    emit(type: 'image', data: {timestamp: number, buffer: Buffer}): any;
}
