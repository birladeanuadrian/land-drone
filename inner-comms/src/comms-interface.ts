

export type MessageHandler = (message: any) => any;

export type EndpointType = 'comms'|'engine'|'cc';

export const allowedEndpoints = [
    'comms',
    'engine',
    'cc'
];



export interface CommsInterface {

    sendMessage(endpoint: EndpointType, message: any, priority: number): Promise<void>;

    onMessage(endpoint: EndpointType, handler: MessageHandler): void;

}
