
import {Component, Input, ViewChild, ElementRef, Renderer} from '@angular/core';
import {AbstractComponent} from './abstract.class.component';
import {BlackOverlay} from '../component/blackoverlay.component';

@Component({
  selector: 'top-nav',
  providers: [],

  template:
  `<div class="topNav">
  <nav>
  <a routerLink="/bike" routerLinkActive="active"><img src="../img/logo.png" alt="app-logo" id="app-logo"></a>
  <ul class="pull-right" style="margin-right:10px;">
  <li routerLink="/bike" routerLinkActive="active">
  <div>
  <i class="fa fa-map-marker fa-2x custom-i" id="bike"></i>
  <span>Location</span>
  </div>
  </li>
  <li routerLink="/analyze" routerLinkActive="active" id="analyze">
  <div>
  <i class="fa fa-area-chart fa-2x custom-i"></i>
  <span>Info</span>
  </div>
  </li>
  <li>
  <div (click)="logout()">
  <i class="fa fa-sign-out fa-2x custom-i"></i>
  <span>Logout</span>
  </div>
  </li>
  </ul>
  </nav>
  </div>

  `
})
export class TopNavigation  extends AbstractComponent{
  logout(){
    localStorage.removeItem('userInfo');
    localStorage.removeItem('destination');
    localStorage.removeItem('location');
    localStorage.removeItem('sensor');
    localStorage.removeItem('estimateDistance');
    localStorage.removeItem('locationName');
    localStorage.removeItem('estimateTime');
    localStorage.removeItem("timeStart") ;
    localStorage.removeItem('showInstruction');
    window.location.reload();
  }
}
