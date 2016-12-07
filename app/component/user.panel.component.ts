import { Component, OnInit, ViewChild, trigger, state, style, animate, transition, Input} from '@angular/core';
import {AbstractComponent} from './abstract.class.component';
import {BlackOverlay} from '../component/blackoverlay.component';
import {Coords} from '../models/location';

declare var Chart:any;

@Component({
  selector: 'user-panel',
  animations: [

  trigger("animationUserInfo", [
    state("open", style({height:"100%",opacity:'1', display: "block"})),
    state("close", style({height: "0",opacity:'0', display: "none" })),
    transition("open <=> close", animate( "250ms" )),
    ])
  ],
  template: `<div class="userInfo" [@animationUserInfo]="state">
  <div class="container">
  <div class="row">
  <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xs-offset-4 col-sm-offset-4 col-md-offset-4 col-lg-offset-4 panel">
  <img src="../img/bicycling.jpg" alt="bicycling">
  <br>
  {{name}}<br>
  Last location: {{location}}<br>
  <button class="">Log out</button>
  </div>
  </div>
  </div>
  </div>`,
  providers: []
})

export class UserComponent extends AbstractComponent implements OnInit {
  name:string = "No data";
  location: string = "No data";
  time:any;

  ngOnInit(){
    (localStorage.getItem('userInfo'))?this.name = localStorage.getItem('userInfo'):this.name;
    (localStorage.getItem('userLastLocation'))?this.location = localStorage.getItem('userLastLocation'):this.location;
  }
}
