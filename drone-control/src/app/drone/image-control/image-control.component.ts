import {Component, Input, OnInit} from '@angular/core';
import * as CanvasGauges from 'ng-canvas-gauges';
import {CloudSocket} from '../../shared/services/cloud-socket';
import {AngularImageEmitter} from '../image-viewer/angular-image-emitter';

@Component({
  selector: 'app-image-control',
  templateUrl: './image-control.component.html',
  styleUrls: ['./image-control.component.scss']
})
export class ImageControlComponent implements OnInit {

    @Input() cloudSocket: CloudSocket;
    @Input() imageEmitter: AngularImageEmitter;

    direction = 0;
    acceleration = 0;

    // @ts-ignore
    accelerationOptions: CanvasGauges.RadialGaugeOptions = {
        minValue: -8,
        maxValue: 8,
        majorTicks: [-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4,
        5, 6, 7, 8]
    };

    // @ts-ignore
    gaugeOptions: CanvasGauges.LinearGaugeOptions = {
        tickSide: 'left',
        minValue: -1,
        maxValue: 1,
        units: 'Direction',
        value: this.direction,
        majorTicks: ['LEFT', 'CENTER', 'RIGHT'],
        minorTicks: 2,
        borders: true,
        numberSide: 'left',
        needleSide: 'left',
        needleType: 'arrow',
        highlights: [],
        strokeTicks: true
    };

    constructor() {}

    ngOnInit() {}

    arrowUp(event) {
        console.log('Arrow up', event);
        if (this.acceleration === 8) {
            return;
        }
        this.acceleration += 1;
        this.cloudSocket.sendCommand(this.direction, this.acceleration);
    }

    arrowDown(event) {
        console.log('Arrow down', event);
        if (this.acceleration === -8) {
            return;
        }
        this.acceleration -= 1;
        this.cloudSocket.sendCommand(this.direction, this.acceleration);
    }

    arrowLeft(event) {
        if (this.direction === -1) {
            return;
        }
        console.log('Arrow left', event);
        this.direction -= 0.1;
        this.cloudSocket.sendCommand(this.direction, this.acceleration);
    }

    arrowRight(event) {
        if (this.direction === 1) {
            return;
        }
        console.log('Arrow right', event);
        this.direction += 0.1;
        this.cloudSocket.sendCommand(this.direction, this.acceleration);
    }
}
