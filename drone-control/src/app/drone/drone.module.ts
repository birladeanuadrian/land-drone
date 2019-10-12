import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DroneComponent } from './drone.component';
import {ImageControlComponent} from './image-control/image-control.component';
import {ImageViewerComponent} from './image-viewer/image-viewer.component';
import {RouterModule, Routes} from '@angular/router';
import { ChartsModule as Ng2Charts } from 'ng2-charts';
import {GaugesModule} from 'ng-canvas-gauges';

const routes: Routes = [
    {
        path: '', component: DroneComponent
    }
];


@NgModule({
    declarations: [
        DroneComponent,
        ImageViewerComponent,
        ImageControlComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        Ng2Charts,
        GaugesModule
    ],
    exports: [
        ImageControlComponent,
        ImageViewerComponent,
        RouterModule
    ]
})
export class DroneModule { }
