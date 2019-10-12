import { Component, OnInit } from '@angular/core';
import {AngularImageEmitter} from './image-viewer/angular-image-emitter';
import {CloudSocket} from '../shared/services/cloud-socket';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-drone',
    templateUrl: './drone.component.html',
    styleUrls: ['./drone.component.scss']
})
export class DroneComponent implements OnInit {

    imageReceiver: CloudSocket;
    angularImageEmitter: AngularImageEmitter;

    constructor(private http: HttpClient) {
        this.angularImageEmitter = new AngularImageEmitter();
        this.imageReceiver = new CloudSocket(this.angularImageEmitter, this.http);
    }

    ngOnInit() {
    }

}
