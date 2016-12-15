import { Component, OnInit, ViewChild, trigger, state, style, animate, transition, Input} from '@angular/core';
import {MapComponent} from '../map/map.component';

@Component({
  selector: 'info',
  template: `
  <div class="title" (click)="toggle()">{{name}}</div>
  <div class="bicylingInfo" [hidden]='!open'>
  <table>
  <tr>
  <td>
  Estimate Distance
  </td>
  <td>
  {{estimateDistance}} km
  </td>
  </tr>
  <tr>
  <td>
  Estimate Time
  </td>
  <td>
  {{estimateTime}}
  </td>
  </tr>
  </table>
  <hr>
  <table>
  <tr [hidden] ="hasSensor">
  <td colspan="2">
  <div class="alert alert-danger"><a style="color:#a94442" routerLink="/analyze" (click)="openInfo()">Please pair your device at Info</a></div>
  </td>
  </tr>
  <tr [hidden] ="!hasSensor||hasLocation">
  <td colspan="2">
  <div class="alert alert-danger">No data</div>
  </td>
  </tr>
  <tr [hidden] ="!hasSensor||!hasLocation">
  <td>
  Current Speed
  </td>
  <td>
  {{velocity|number:'1.0-0'}} km/h
  </td>
  </tr>
  <tr [hidden] ="!hasSensor||!hasLocation">
  <td>
  Running Time
  </td>
  <td>
  {{printDiff(runningTime)}}
  </td>
  </tr>
  <tr [hidden] ="!hasSensor||!hasLocation">
  <td>
  Time Left
  </td>
  <td>
  {{printDiff((estimateDistance/velocity)*3600000)}}
  </td>
  </tr>
  <tr [hidden] ="!hasSensor||!hasLocation">
  <td>
  Heart Rate
  </td>
  <td>
  {{heartRate}} bpm
  </td>
  </tr>
  <tr [hidden] ="!hasSensor||!hasLocation">
  <td>
  Burned Calories
  </td>
  <td>
  {{calories}} cal
  </td>
  </tr>
  <tr [hidden] ="!hasSensor||!hasLocation">
  <td style="vertical-align: top;">
  Last Update
  </td>
  <td class="newline">{{lastUpdate}}</td>
  </tr>
  </table>
  </div>`,
  providers: []
})

export class Info implements OnInit{
  name:string = "User name";
  open:boolean = true;
  estimateDistance:number = 0;
  estimateTime:string = '00:00:00';
  pastDistance:number = 0;
  distance:number = 0;
  velocity:number = 0.01;
  avarage:number = 0 ;
  calories:number = 0;
  runningTime:number = 0;
  heartRate:number = 0;
  hasSensor:boolean=false;
  hasLocation:boolean = false;
  map:any;
  lastUpdate:string = 'No data';
  timePause:number = 0;
  minimumVelo:number = 2;
  maximumInactiveTime:number = 60*60*1000;
  updateTimeInSecond:number = 2000;
  oldLat:number = -1;
  oldLng:number = -1;

  toggle(){
    this.open? this.open = false:this.open = true;
  }
  load(_map:any){
    this.map = _map;
  }
  ngOnInit(){
    try{
      if(localStorage.getItem("runningTime") !== null){
        this.runningTime = Number(localStorage.getItem("runningTime"));
      }
      setTimeout(()=>{
        this.updateData();
        this.updateTime();
      },500);
      setInterval(()=>{
        this.updateData();
      },this.updateTimeInSecond);
      setInterval(()=>{
        this.updateTime();
      },1000);
    }
    catch(e){

    }
  }

  updateData(){
    try {
      if(localStorage.getItem("location")!==null){
        var JSONObject= JSON.parse(localStorage.getItem("location"));
        var lastObject = JSONObject[Object.keys(JSONObject).length-1];
        this.map.placeCenterMarker(lastObject.lat,lastObject.lon, lastObject.yaw);

        if(lastObject.velocity<=0){
          this.velocity = 0.01;
        }else {
          this.velocity = lastObject.velocity;
        }
        this.lastUpdate = this.printDate(new Date(lastObject.timestamp));
      } else {
        this.velocity=0.01;
        this.map.clearCenterMarker();
        localStorage.setItem('locationName',"No data");
        this.lastUpdate = 'No data';
      }
      if(localStorage.getItem("userInfo") !== null){
        this.name = localStorage.getItem("userInfo");
      }
      if(localStorage.getItem("estimateDistance") !== null){
        this.estimateDistance = Number(localStorage.getItem("estimateDistance"))/1000;
      }else {
        this.estimateDistance=0;
      }
      if(localStorage.getItem("estimateTime") !== null){
        this.estimateTime = this.printDiff(Number(localStorage.getItem("estimateTime"))*1000);
      }else {
        this.estimateTime='00:00:00';
      }
      if(localStorage.getItem("heartRate") !== null){
        var JSONObject= JSON.parse(localStorage.getItem("heartRate"));
        var lastObject = JSONObject[Object.keys(JSONObject).length-1];
        this.heartRate = Number(lastObject.hr);
      }else {
        this.heartRate = 0;
      }
      if(localStorage.getItem("sensor") !== null){
        this.hasSensor = true;
      }else {
        this.hasSensor = false;
      }
      if(localStorage.getItem('location')!==null){
        this.hasLocation = true;
      }else{
        this.hasLocation = false;
      }
      this.calculateCalories(this.velocity);
    }
    catch (e) {
      console.log(e);
    }
  }

  updateTime(){
    //do not start counter if velo < minimun velo
    if(this.velocity >= this.minimumVelo && localStorage.getItem("location")!==null){
      localStorage.setItem("timeStart", String(new Date()));
      this.runningTime+=1000;
      localStorage.setItem("runningTime",String(this.runningTime));
      if(this.runningTime%this.updateTimeInSecond==0){
        //another counter, you don't want to take all user resource by updating all the time
        var cyclingCoordinates:any = [];
        var JSONObject= JSON.parse(localStorage.getItem("location"));
        var lastObject = JSONObject[Object.keys(JSONObject).length-1];
        if(lastObject.lat != this.oldLat|| lastObject.lon !=this.oldLng ){
          for (var x in JSONObject){
            if(this.diffTwoDay(new Date(), new Date(JSONObject[x].timestamp)) <= this.runningTime){
              console.log('jump');
              var temp = {lat:JSONObject[x].lat, lng:JSONObject[x].lon};
              cyclingCoordinates.push(temp);
            }
          }
          console.log('end');
          this.map.drawCyclingPath(cyclingCoordinates);
        }

      }
    }

    if(localStorage.getItem("timeStart")!==null){
      if(this.diffTwoDay(new Date(), new Date(localStorage.getItem("timeStart"))) >this.maximumInactiveTime){
        this.runningTime = 0;
        this.map.clearCyclingPath();
      }
    }
  }

  diffTwoDay(_date1:any, _date2:any):number{
    var timeDiff = Math.abs(_date1.getTime() - _date2.getTime());
    return timeDiff;
  }

  printDiff(timeDiff:number):string{
    var diffHour = Math.round((timeDiff % 86400000) / 3600000);
    var diffMinute = Math.round(((timeDiff % 86400000) % 3600000) / 60000);
    var diffSecond = Math.round((((timeDiff % 86400000) % 3600000) % 60000) /1000);
    return ("0"+(String)(diffHour)).slice(-2)+ ":" +  ("0"+(String)(diffMinute)).slice(-2) + ":" +  ("0"+(String)(diffSecond)).slice(-2);
  }
  printDate(_date:any):string{
    var _date_print = ("0"+(String)(_date.getHours())).slice(-2)+ ":" + ("0"+(String)(_date.getMinutes())).slice(-2)+ ":"+ ("0"+(String)(_date.getSeconds())).slice(-2)+ "\r\n"+_date.toDateString();
    return _date_print;
  }

  calculateCalories(_veloc:number){
    if(this.minimumVelo<_veloc && _veloc<4.4){
      this.calories = 4 * this.runningTime/60000;
    } else if(_veloc<5.3){
      this.calories = 6 * this.runningTime/60000;
    } else if(_veloc<6.25){
      this.calories = 8 * this.runningTime/60000;
    }else if(_veloc<7.15){
      this.calories = 10 * this.runningTime/60000;
    }else if(_veloc<8.9){
      this.calories = 12 * this.runningTime/60000;
    }else if(_veloc>=8.9){
      this.calories = 16 * this.runningTime/60000;
    }
    this.calories = Math.round(this.calories);
  }

  openInfo(){
    setTimeout(()=>{
      document.getElementById("analyze").click();
    },100);

  }
}
