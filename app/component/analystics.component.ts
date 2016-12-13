import { Component, OnInit, AfterViewInit, ViewChild, trigger, state, style, animate, transition, Input} from '@angular/core';
import {AbstractComponent} from './abstract.class.component';
import {BlackOverlay} from '../component/blackoverlay.component';
import {Coords} from '../models/location';
import {Sensor} from '../component/sensor.panel.component';
import {MapComponent} from '../map/map.component';
import { CarouselComponent } from '../component/instruction.component';
declare var AmCharts:any;

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
  <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 panel" id="bicyclingDiv">
  <div class="inner" id="bicylingInner">
  <img src="../img/bicycling.jpg" alt="bicycling" id="bicylingPanel">
  <div  id="bicylingContent">
  <i class="fa fa-user" aria-hidden="true"></i><span>{{name}}</span><br>
  <i class="fa fa-map-marker" aria-hidden="true"></i><span>{{location}}</span><br>
  <button (click)="sensor.showLgModal()">Pair Sensors</button>
  <button (click)="carouselComponent.showInstruction()">Instruction</button>
  </div>
  </div>
  </div>
  <div class="col-xs-9 col-sm-9 col-md-9 col-lg-9 chartDiv" id="bicyclingDiv2">
  <div [hidden]="hasSensor">
  <div class="alert alert-danger">Please pair your device for analysis</div>
  </div>
  <div [hidden]="!hasSensor">
  <div class="appNav">
  <button class="active" id = "distanceBtn" >DISTANCE</button><!--
  !--><button id = "caloriesBtn" >CALORIES</button>
  </div>
  <div id="myChart2" ></div>
  <div id="myChart"></div>
  </div>
  </div>
  </div>
  </div>
  </div>
  <sensor>`,
  providers: []
})

export class Analyze extends AbstractComponent implements OnInit,AfterViewInit {
  name:string = "No data";
  location: string = "No data";
  hasSensor:boolean = false;
  map:any;
  carouselComponent:any;
  chart:any;
  chart2:any;
  @ViewChild(Sensor)
  private sensor: Sensor;

  ngOnInit(){
    (localStorage.getItem('userInfo'))?this.name = localStorage.getItem('userInfo'):this.name;
    document.getElementById('btn-success').onclick = ()=>{
      setTimeout(()=>{
        this.graph();
      },1500);
    }
    setInterval(()=>{
      this.getData();
    },2000);
  }
  ngAfterViewInit(){
    this.graph();
  }


  gatherDistance():any{
    var myData:any = [{"distance":0,"timestamp":new Date()}];
    if(localStorage.getItem('location')!==null){
      var source = JSON.parse(localStorage.getItem('location'));
      var distance =0;
      var obj:any;
      myData = [];
      for(var i =0; i<Object.keys(source).length;i++){
        if(i>0){
          var _date1 = (new Date(source[i-1].timestamp));
          var _date2 = (new Date(source[i].timestamp));
          var _date_diff = Math.abs(_date2.getTime()-_date1.getTime())/1000;
          if(_date2.getDate()==_date1.getDate()){
            if(_date_diff< (60*5)){//maximum allow diffrent between two times is 5 minutes
              var _temp_distance = this.distance(source[i-1].lat,source[i-1].lon,source[i].lat,source[i].lon);
              distance+=_temp_distance;
            }
            obj = { 
              "timestamp": _date1,
              "distance": Math.round(distance)
            };
          }else{
            myData.push(obj);
            distance=0;
          }
        } 
      }
      if(myData[myData.length-1].timestamp != obj.timestamp){
        myData.push(obj);
        distance=0;
      }
    }
    return myData
  }

  distance(lat1:number, lon1:number, lat2:number, lon2:number){
    var R = 6371; // km
    var dLat = this.toRad(lat2-lat1);
    var dLon = this.toRad(lon2-lon1);
    var lat1 = this.toRad(lat1);
    var lat2 = this.toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
  }
  toRad(Value:number){
    return Value * Math.PI / 180;
  }

  graph(){
      /*
    * AmChart Object
    */
    this.chart = AmCharts.makeChart("myChart", {
      "type": "serial",
      "theme": "light",
      "marginTop":0,
      "marginRight": 80,
      "dataProvider": this.gatherDistance(),
      "graphs": [{
        "id":"g1",
        "balloonText": "[[category]]<br><b><span style='font-size:12px;'>[[value]] km</span></b>",
        "bullet": "round",
        "bulletSize": 8,
        "lineColor": "#d1655d",
        "lineThickness": 2,
        "negativeLineColor": "#637bb6",
        "negativeBase": 60.2,
        "type": "smoothedLine",
        "valueField": "distance"
      }],
      "chartScrollbar": {
        "graph":"g1",
        "gridAlpha":0,
        "color":"#888888",
        "scrollbarHeight":55,
        "backgroundAlpha":0,
        "selectedBackgroundAlpha":0.1,
        "selectedBackgroundColor":"#888888",
        "graphFillAlpha":0,
        "autoGridCount":true,
        "selectedGraphFillAlpha":0,
        "graphLineAlpha":0.2,
        "graphLineColor":"#c2c2c2",
        "selectedGraphLineColor":"#888888",
        "selectedGraphLineAlpha":1

      },
      "chartCursor": {
        "categoryBalloonDateFormat": "MMM DD, YYYY",
        "cursorAlpha": 0,
        "valueLineEnabled":true,
        "valueLineBalloonEnabled":true,
        "valueLineAlpha":0.5,
        "fullWidth":true
      },
      "dataDateFormat": "YYYY-MM-DD",
      "categoryField": "timestamp",
      "categoryAxis": {
        "parseDates" : true,
        "minPeriod": "mm",
        "minorGridEnabled": false,
      }, "export": {
        "enabled": true
      }
    });
    this.chart2 = AmCharts.makeChart("myChart2", {
      "type": "serial",
      "theme": "light",
      "marginTop":0,
      "marginRight": 80,
      "dataProvider": JSON.parse(localStorage.getItem('location')),
      "graphs": [{
        "id":"g2",
        "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        "bullet": "round",
        "bulletSize": 8,
        "lineColor": "#d1655d",
        "lineThickness": 2,
        "negativeLineColor": "#637bb6",
        "negativeBase": 60.2,
        "type": "smoothedLine",
        "valueField": "velocity"
      }],
      "chartScrollbar": {
        "graph":"g2",
        "gridAlpha":0,
        "color":"#888888",
        "scrollbarHeight":55,
        "backgroundAlpha":0,
        "selectedBackgroundAlpha":0.1,
        "selectedBackgroundColor":"#888888",
        "graphFillAlpha":0,
        "autoGridCount":true,
        "selectedGraphFillAlpha":0,
        "graphLineAlpha":0.2,
        "graphLineColor":"#c2c2c2",
        "selectedGraphLineColor":"#888888",
        "selectedGraphLineAlpha":1

      },
      "chartCursor": {
        "categoryBalloonDateFormat": "JJ:NN:SS MMM DD, YYYY",
        "cursorAlpha": 0,
        "valueLineEnabled":true,
        "valueLineBalloonEnabled":true,
        "valueLineAlpha":0.5,
        "fullWidth":true
      },
      "dataDateFormat": "YYYY-MM-DD JJ:NN:SS",
      "categoryField": "timestamp",
      "categoryAxis": {
        "parseDates" : true,
        "minPeriod": "mm",
        "minorGridEnabled": false,
      }, "export": {
        "enabled": true
      }
    });
    /*
    * End of AmChart Object
    */
  }
  load(_map:any, _carol:any){
    this.map = _map;
    this.carouselComponent= _carol;
  }
  getData(){
    if(localStorage.getItem("sensor") !== null){
      this.hasSensor = true;
    } else {
      this.hasSensor = false;
    }
    if(localStorage.getItem('locationName')!==null){
      this.location= localStorage.getItem('locationName');
    }else{
      this.location= "No data";
    }
  }
}
