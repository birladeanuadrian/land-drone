import {Component, Input, OnInit} from '@angular/core';
import {AngularImageEmitter} from './angular-image-emitter';
import {DomSanitizer} from '@angular/platform-browser';
import {CloudSocket} from '../../shared/services/cloud-socket';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {

    @Input() imageReceiver: CloudSocket;
    @Input() angularImageEmitter: AngularImageEmitter;

    image = '';
    delay = 0;

    constructor(private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.imageReceiver.listen();
        this.angularImageEmitter.on('image', data => {
            this.delay = new Date().getTime() - data.timestamp;
            const imageData = 'data:image/jpeg;base64,' + data.buffer.toString('base64');
            this.sanitizer.bypassSecurityTrustUrl(imageData);
            this.image = imageData;
        });
    }

}
