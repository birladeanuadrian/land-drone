import 'mocha';
import {RabbitDroneComms} from "../src/rabbit/rabbit-drone-comms";
import {EndpointType} from "../src";

describe('Rabbit Drone Comms Tests', () => {

    let rabbitComms: RabbitDroneComms;

    before(async () => {
        RabbitDroneComms.amqpUrl = 'amqp://drone:drone@127.0.0.1:5672/';
        rabbitComms = await RabbitDroneComms.getComms();
    });

    after(async () => {
        rabbitComms.stop();
    });

    it ('Should send and receive messages', () => {
        return new Promise((resolve, reject) => {
            const message = 'test';
            const endpoint: EndpointType = 'engine';
            rabbitComms.onMessage(endpoint, msg => {
                if (msg !== message) {
                    reject(`Received ${msg} instead of ${message}`);
                } else {
                    resolve();
                }
                rabbitComms.stop();
            });
            rabbitComms.sendMessage(endpoint, message);
        });
    });

});

