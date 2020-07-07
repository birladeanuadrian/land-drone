import { Component, OnInit } from '@angular/core';
import {CloudSocketService} from "../shared/services/cloud-socket.service";

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {

  acceleration: number;

  direction: number;

  password = '';

  activeTracking = false;

  activeRecording = false;

  constructor(private cloudSocketService: CloudSocketService) { }

  ngOnInit(): void {
    this.acceleration = 0;
    this.direction = 0;
  }

  login() {
    if (!this.password) {
      alert('Please enter password first');
      return;
    }
    this.cloudSocketService.login(this.password);
  }

  increaseAcceleration() {
    if (this.acceleration === 100) {
      alert('Max acceleration reached');
      return;
    }
    if (this.acceleration === 0) {
      this.acceleration += 30;
    } else {
      this.acceleration += 10;
    }
    this.sendCommand();

  }

  decreaseAcceleration() {
    if (this.acceleration === -100) {
      alert('Max reverse reached');
      return;
    }

    if (this.acceleration === 0) {
      this.acceleration = -30;
    } else {
      this.acceleration -= 10;
    }
    this.sendCommand();
  }

  steerLeft() {
    if (this.direction === -100) {
      alert('Max steer left reached');
      return;
    }
    this.direction -= 10;
    this.sendCommand();
  }

  steerRight() {
    if (this.direction === 100) {
      alert('Max steer right reached');
      return;
    }
    this.direction += 10;
    this.sendCommand();
  }

  startTracking() {
    this.activeTracking = true;
    console.log('Start tracking');
    this.cloudSocketService.startTracking();
  }

  stopTracking() {
    this.activeTracking = false;
    console.log('Stop tracking');
    this.cloudSocketService.stopTracking();
  }

  startRecording() {
    this.activeRecording = true;
    console.log('Start recording');
    this.cloudSocketService.startRec();
  }

  stopRecording() {
    this.activeRecording = false;
    console.log('Stop recording');
    this.cloudSocketService.stopRec();
  }

  private sendCommand() {
    this.cloudSocketService.sendCommand(this.acceleration, this.direction);
  }
}


