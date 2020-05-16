import cluster from "cluster";
import {Dispatcher} from "./dispatcher";
import {Receiver} from "./receiver";


if (cluster.isMaster) {
    const worker = cluster.fork();
    const receiver = new Receiver(worker);
    receiver.run();
} else {
    const dispatcher = new Dispatcher();
    dispatcher.run();
}
