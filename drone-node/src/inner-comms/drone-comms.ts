
import {CommsInterface, MessageHandler, EndpointType} from "./comms-interface";
import {RabbitDroneComms} from "./rabbit/rabbit-drone-comms";



export class DroneComms implements CommsInterface {
    private worker: CommsInterface;

    private constructor(worker: CommsInterface) {
        this.worker = worker;
    }

    static async getComms(): Promise<CommsInterface> {
        const rabbitComms = await RabbitDroneComms.getComms();
        return new DroneComms(rabbitComms);
    }

    async sendMessage(endpoint: EndpointType, message: any, priority: number) {
        return await this.worker.sendMessage(endpoint, message, priority);
    }

    onMessage(endpoint: EndpointType, handler: MessageHandler) {
        this.worker.onMessage(endpoint, handler);
    }
}
