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
  ABCD
  </div>`,
  providers: []
})

export class UserComponent extends AbstractComponent implements OnInit {
  name:string = "No data";
  time:any;

  ngOnInit(){
    
  }
}
