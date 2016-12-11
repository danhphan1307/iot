import { Component, OnInit, ViewChild, trigger, state, style, animate, transition, Input} from '@angular/core';
import {AbstractComponent} from './abstract.class.component';
import {BlackOverlay} from '../component/blackoverlay.component';
import {Coords} from '../models/location';
import {Sensor} from '../component/sensor.panel.component';
import {MapComponent} from '../map/map.component';

@Component({
  selector: 'analyze',
  animations: [

  trigger("animationBottomNav", [
    state("open", style({height:"100%",opacity:'1', display: "block"})),
    state("close", style({height: "0",opacity:'0', display: "none" })),
    transition("open <=> close", animate( "250ms" )),
    ])
  ],
  template: `<div class="bottomDiv userInfo" [@animationBottomNav]="state">
  <div class="container">
  <div class="row">
  <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 panel">
  <div class="inner">
  <img src="../img/bicycling.jpg" alt="bicycling">
  <i class="fa fa-user" aria-hidden="true"></i><span>{{name}}</span><br>
  <i class="fa fa-map-marker" aria-hidden="true"></i><span>{{location}}</span><br>
  <button (click)="sensor.showLgModal()">Change Sensors</button>
  </div>
  </div>
  <div class="col-xs-9 col-sm-9 col-md-9 col-lg-9 chartDiv">
  <div [hidden]="hasSensor">
  <div class="alert alert-danger">Please add sensor for analysis</div>
  </div>
  <div [hidden]="!hasSensor">
  <div class="appNav">
  <button class="active" id = "distanceBtn" >DISTANCE</button><!--
  !--><button id = "caloriesBtn" >CALORIES</button>
  </div>
  <canvas id="myChart"></canvas>
  <canvas id="myChart2" ></canvas>
  </div>
  </div>
  </div>
  </div>
  </div>
  <sensor>`,
  providers: []
})

export class Analyze extends AbstractComponent implements OnInit {
  name:string = "No data";
  location: string = "No data";
  hasSensor:boolean = false;
  map:any;

  @ViewChild(Sensor)
  private sensor: Sensor;

  ngOnInit(){
    (localStorage.getItem('userInfo'))?this.name = localStorage.getItem('userInfo'):this.name;

    setInterval(()=>{
      this.getData();
    },2000);
  }
  load(_map:any){
    this.map = _map;
  }
  getData(){
    if(localStorage.getItem("sensor") !== null){
      this.hasSensor = true;
    } else {
      this.hasSensor = false;
    }
    if(localStorage.getItem('locationName')!==null){
       this.location= localStorage.getItem('locationName');
    }
  }
}
