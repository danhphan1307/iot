
import {Component, Input, ViewChild, ElementRef, Renderer} from '@angular/core';
import {AbstractComponent} from './abstract.class.component';
import {BlackOverlay} from '../component/blackoverlay.component';

@Component({
  selector: 'top-nav',
  providers: [],

  template:
  `<div class="topNav">
  <nav>
  <a routerLink="/bike" routerLinkActive="active" id="bike"><img src="../img/logo.png" alt="app-logo" id="app-logo"></a>
  <ul class="pull-right" style="margin-right:10px;">
  <li routerLink="/station" routerLinkActive="active" id="station">
  <div>
  <i class="fa fa-map-marker fa-2x custom-i"></i>
  <span>City Bikes</span>
  </div>
  </li>
  <li routerLink="/analyze" routerLinkActive="active" id="analyze">
  <div>
  <i class="fa fa-area-chart fa-2x custom-i"></i>
  <span>Analytics</span>
  </div>
  </li>
  <li routerLink="/user" routerLinkActive="active" id="user">
  <div>
  <i class="fa fa-user-o fa-2x custom-i"></i>
  <span>User Info</span>
  </div>
  </li>
  </ul>
  </nav>
  </div>

  `
})
export class TopNavigation  extends AbstractComponent{

}
