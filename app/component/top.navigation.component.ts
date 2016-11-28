
import {Component, Input, ViewChild, ElementRef, Renderer} from '@angular/core';
import {AbstractComponent} from './abstract.class.component';
import {BlackOverlay} from '../component/blackoverlay.component';

@Component({
  selector: 'top-nav',
  providers: [],

  template:
  `

  <div class="topNav">
  <nav>
  <ul>
  <li routerLink="/bike">
  <div>
  <img src="../img/logo.png" alt="app-logo" id="app-logo">
  </div>
  </li>
  <li routerLink="/bike" routerLinkActive="active" id="bike">
  <div>
  <i class="fa fa-bicycle fa-2x custom-i"></i>
  <span>Bike</span>
  </div>
  </li>
  <li routerLink="/station" routerLinkActive="active" id="station">
  <div>
  <i class="fa fa-map-marker fa-2x custom-i"></i>
  <span>City Bikes</span>
  </div>
  </li>
  <li routerLink="/user" routerLinkActive="active" id="user">
  <div>
  <i class="fa fa-user-o fa-2x custom-i"></i>
  <span>User</span>
  </div>
  </li>
  </ul>
  </nav>
  </div>

  `
})
export class TopNavigation  extends AbstractComponent{

}
