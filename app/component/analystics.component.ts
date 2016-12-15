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
  <img src="img/user_icon.png" alt="user icon" id="user_icon"  (click)="show_left()"/>
  <div class="container">
  <div class="row">
  <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 panel" id="bicyclingDiv">
  <div class="inner" id="bicylingInner">
  <div id="bicylingPanel"><img src="img/user_icon.png" alt="user icon" (click)="hide_left()"/><h2>{{ name}}</h2></div>
  <div id="bicylingContent">
  <i class="fa fa-map-marker" aria-hidden="true"></i><span style="display:inline-block">{{location}}</span><br>
  <button (click)="sensor.showLgModal()">Pair Sensors</button>
  <div [hidden]="!hasSensor"><button (click)="updateChart()">Update Charts</button></div>
  <button (click)="carouselComponent.showInstruction()">Instruction</button>
  </div>
  </div>
  </div>
  <div class="col-xs-9 col-sm-9 col-md-9 col-lg-9 chartDiv" id="bicyclingDiv2">
  <div [hidden]="hasSensor">
  <div class="alert alert-danger">Please pair your device for analysis</div>
  </div>
  <div [hidden]="!hasSensor||hasLocation">
  <div class="alert alert-danger">No data</div>
  </div>
  <div [hidden]="!hasSensor||!hasLocation">
  <div class="analyzeNav">
  <button class="active" id = "distanceBtn" >DISTANCE</button><!--
  !--><button id = "caloriesBtn" >CALORIES</button><!--
  !--><button id = "heartRateBtn" >HEART RATE</button>
  </div>
  <div id="myChart3"></div>
  <div id="myChart2"></div>
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
  hasLocation:boolean = false;
  map:any;
  carouselComponent:any;
  chart:any;
  chart2:any;
  chart3:any;
  @ViewChild(Sensor)
  private sensor: Sensor;

  ngOnInit(){
    (localStorage.getItem('userInfo'))?this.name = localStorage.getItem('userInfo'):this.name;
    document.getElementById('btn-success').onclick = ()=>{
      if((<HTMLInputElement>document.getElementById('input1')).value!=localStorage.getItem('sensor')){
        setTimeout(()=>{
          this.graph(this.gatherDistance(), this.gatheCalories(), this.gatheHeartRate());
        },1500);
      }

    }
    setInterval(()=>{
      this.getData();
    },2000);
  }
  ngAfterViewInit(){
    this.graph(this.gatherDistance(), this.gatheCalories(), this.gatheHeartRate());
  }
  diffTwoDay(_date1:any, _date2:any):number{
    var timeDiff = (Math.abs(_date1.getTime() - _date2.getTime()))/1000;
    return timeDiff;
  }
  updateChart(){
    if(this.gatherDistance().distance!=0 && this.gatheCalories().calories!=0  && this.gatheHeartRate().hr!=0){
      this.graph(this.gatherDistance(),this.gatheCalories(),this.gatheHeartRate());
    }
  }
  hide_left(){
    document.getElementById('bicyclingDiv').style.display='none';
    document.getElementById('user_icon').style.display='block';
    document.getElementById('bicyclingDiv2').className= 'col-xs-9 col-sm-9 col-md-9 col-lg-9 chartDiv fullWidth';
    
  }
  show_left(){
    document.getElementById('bicyclingDiv').style.display='block';
    document.getElementById('user_icon').style.display='none';
    document.getElementById('bicyclingDiv2').className= 'col-xs-9 col-sm-9 col-md-9 col-lg-9 chartDiv';
  }

  gatheHeartRate():any{
    var myData:any = [{"hr":0,"timestamp":new Date()}];
    if(localStorage.getItem('heartRate')!==null){
      myData = JSON.parse(localStorage.getItem('heartRate'));
      myData = myData.filter((_data:any)=>{
        return _data.hr > 0;
      })
    }
    return myData
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
          var _date_diff = this.diffTwoDay(_date2,_date1);
          if(_date2.getDate()==_date1.getDate()){
            if(_date_diff< (60*5)){//maximum allow diffrent between two times is 5 minutes
              var _temp_distance = this.distance(source[i-1].lat,source[i-1].lon,source[i].lat,source[i].lon);
              distance+=_temp_distance;
            }
            obj = { 
              "timestamp": _date1,
              "distance": distance.toFixed(2)
            };
          }else{
            myData.push(obj);
            distance=0;
          }
        } 
      }
      if(myData.length>=1){
        if(myData[myData.length-1].timestamp != obj.timestamp){
          myData.push(obj);
          distance=0;
        }
      }
    }
    return myData
  }

  gatheCalories():any{
    var myData:any = [{"calories":0,"timestamp":new Date()}];
    if(localStorage.getItem('location')!==null){
      var source = JSON.parse(localStorage.getItem('location'));
      var calories =0;
      var obj:any;
      myData = [];
      for(var i =0; i<Object.keys(source).length;i++){
        if(i>0){
          var _date1 = (new Date(source[i-1].timestamp));
          var _date2 = (new Date(source[i].timestamp));
          var _date_diff = this.diffTwoDay(_date2,_date1);
          if(_date2.getDate()==_date1.getDate()){
            if(_date_diff< (60*5)){//maximum allow diffrent between two times is 5 minutes
              calories+=this.calories(source[i-1].velocity,_date_diff);
            }
            obj = { 
              "timestamp": _date1,
              "calories": Math.round(calories)
            };
          }else{
            myData.push(obj);
            calories=0;
          }
        } 
      }
      if(myData.length >=1){
        if(myData[myData.length-1].timestamp != obj.timestamp){
          myData.push(obj);
          calories=0;
        }
      }
    }
    return myData
  }

  calories(_veloc:number, _time:number){
    var calories:any;
    if(_veloc<4.4){
      calories = 4 * _time/60;
    } else if(_veloc<5.3){
      calories = 6 * _time/60;
    } else if(_veloc<6.25){
      calories = 8 * _time/60;
    }else if(_veloc<7.15){
      calories = 10 * _time/60;
    }else if(_veloc<8.9){
      calories = 12 * _time/60;
    }else if(_veloc>=8.9){
      calories = 16 * _time/60;
    }
    calories = Math.round(calories);
    return calories;
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

  graph(_dataDistance:any, _dataCalories:any, _dataHeartRate:any){
      /*
    * AmChart Object
    */
    this.chart = AmCharts.makeChart("myChart", {
      "type": "serial",
      "theme": "light",
      "marginTop":0,
      "marginRight": 65,
      "dataProvider": _dataDistance,
      "graphs": [{
        "id":"g1",
        "balloonText": "[[category]]<br><b><span style='font-size:12px;'>[[value]] km</span></b>",
        "bullet": "round",
        "bulletSize": 8,
        "lineColor": "#d1655d",
        "lineThickness": 2,
        "negativeLineColor": "#637bb6",
        "negativeBase": 10,
        "type": "smoothedLine",
        "valueField": "distance"
      }],
      "chartScrollbar": {
        "graph":"g1",
        "gridAlpha":0,
        "color":"#888888",
        "scrollbarHeight":40,
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
      "dataProvider": _dataCalories,
      "graphs": [{
        "id":"g2",
        "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]] Cal</span></b>",
        "bullet": "round",
        "bulletSize": 8,
        "lineColor": "#d1655d",
        "lineThickness": 2,
        "negativeLineColor": "#637bb6",
        "negativeBase": 400,
        "type": "smoothedLine",
        "valueField": "calories"
      }],
      "chartScrollbar": {
        "graph":"g2",
        "gridAlpha":0,
        "color":"#888888",
        "scrollbarHeight":40,
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
    this.chart3 = AmCharts.makeChart("myChart3", {
      "type": "serial",
      "theme": "light",
      "marginTop":0,
      "marginRight": 80,
      "dataProvider": _dataHeartRate,
      "graphs": [{
        "id":"g3",
        "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]] Cal</span></b>",
        "bullet": "round",
        "bulletSize": 8,
        "lineColor": "#d1655d",
        "lineThickness": 2,
        "negativeLineColor": "#637bb6",
        "negativeBase": 100,
        "type": "smoothedLine",
        "valueField": "hr"
      }],
      "chartScrollbar": {
        "graph":"g3",
        "gridAlpha":0,
        "color":"#888888",
        "scrollbarHeight":40,
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
    if(localStorage.getItem('location')!==null){
      this.hasLocation = true;
    }else{
      this.hasLocation = false;
    }
    if(localStorage.getItem('locationName')!==null){
      this.location= localStorage.getItem('locationName');
    }else{
      this.location= "No data";
    }
  }
}
