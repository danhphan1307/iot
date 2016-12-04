import { Component, OnInit, ViewChild, trigger, state, style, animate, transition, Input} from '@angular/core';
import {AbstractComponent} from './abstract.class.component';
import {BlackOverlay} from '../component/blackoverlay.component';
import {Coords} from '../models/location';

@Component({
  selector: 'user-panel',
  animations: [

  trigger("animationBottomNav", [
    state("open", style({height:"100%",opacity:'1', display: "block"})),
    state("close", style({height: "0",opacity:'0', display: "none" })),
    transition("open <=> close", animate( "250ms" )),
    ])
  ],
  template: `<div class="bottomDiv" [@animationBottomNav]="state">
  <div class="locationPanel"></div><img src="img/person.png" alt="user icon" id="person">
  <div class="content">{{name}}<br>
  <div class="developer">
  <hr>
  <img src="img/logo.png" alt="logo"><br>
  Version: 1.0.0
  </div>
  </div>`,
  providers: []
})

export class UserComponent extends AbstractComponent implements OnInit {
  name:string = "No data";
  time:any;
  ngOnInit(){
    var object = JSON.parse(localStorage.getItem('userLocation'));
    this.name = object.name.en;

  }

  updateSave(event:any){
    if(event!=null){
      this.name = event.name.en;
    }else {
      this.name = "No data";
    }
  }

}
