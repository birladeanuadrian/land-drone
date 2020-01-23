/// <reference lib="webworker" />

import {AngularImageEmitter} from "./angular-image-emitter";
import {CloudSocket} from "../shared/servies/cloud-socket";

addEventListener('message', ({ data }) => {
  const response = `worker response to ${data}`;
  postMessage(response);
});

const imageEmitter = new AngularImageEmitter();
const imageReceiver = new CloudSocket(imageEmitter);

imageEmitter.on('image', data => {
  postMessage(data);
});

imageReceiver.listen();
