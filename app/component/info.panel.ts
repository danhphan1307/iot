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
  <div class="alert alert-danger">Please add sensors at Info</div>
  </td>
  </tr>
  <tr [hidden] ="!hasSensor">
  <td>
  Current Speed
  </td>
  <td>
  {{velocity|number:'1.0-0'}} km/h
  </td>
  </tr>
  <tr [hidden] ="!hasSensor">
  <td>
  Distance Left
  </td>
  <td>
  {{estimateDistance - pastDistance}} km
  </td>
  </tr>
  <tr [hidden] ="!hasSensor">
  <td>
  Time Pass
  </td>
  <td>
  {{printDiff(timePass)}}
  </td>
  </tr>
  <tr [hidden] ="!hasSensor">
  <td>
  Time Left
  </td>
  <td>
  {{printDiff(distance/velocity)}}
  </td>
  </tr>
  <tr [hidden] ="!hasSensor">
  <td>
  Burned Calories
  </td>
  <td>
  {{calories}} cal
  </td>
  </tr>
  <tr [hidden] ="!hasSensor">
  <td>
  Last Update
  </td>
  <td class="newline">
  {{lastUpdate}}
  </td>
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
  timePass:any = 1;
  hasSensor:boolean=false;
  map:any;
  lastUpdate:string = 'No data';


  toggle(){
    this.open? this.open = false:this.open = true;
  }
  load(_map:any){
    this.map = _map;
  }
  ngOnInit(){
    try{
      if(localStorage.getItem("timeStart") !== null){
        this.timePass = this.diffTwoDay(new Date(), new Date (localStorage.getItem('timeStart')));
      }
      setTimeout(()=>{
        this.updateData();
        this.updateTime();
      },500);
      setInterval(()=>{
        this.updateData();
      },2000);
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
        this.map.placeCenterMarker(lastObject.lat,lastObject.lon);
        this.velocity = lastObject.velocity;
        this.lastUpdate = this.printDate(new Date(lastObject.timestamp));
      } else {
        this.velocity=0.01;
        this.map.clearCenterMarker();
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
      if(localStorage.getItem("sensor") !== null){
        this.hasSensor = true;
      }else {
        this.hasSensor = false;
      }
      this.calculateCalories(this.velocity);
    }
    catch (e) {
      console.log(e);
    }
  }

  updateTime(){
    if(this.velocity > 15){
      if(localStorage.getItem("timeStart") == null){
        localStorage.setItem("timeStart",String(new Date()));
      }else {
        this.timePass = this.diffTwoDay(new Date(), new Date (localStorage.getItem('timeStart')));
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
    if(_veloc<4.4){
      this.calories = 4 * this.timePass/60000;
    } else if(_veloc<5.3){
      this.calories = 6 * this.timePass/60000;
    } else if(_veloc<6.25){
      this.calories = 8 * this.timePass/60000;
    }else if(_veloc<7.15){
      this.calories = 10 * this.timePass/60000;
    }else if(_veloc<8.9){
      this.calories = 12 * this.timePass/60000;
    }else if(_veloc>=8.9){
      this.calories = 16 * this.timePass/60000;
    }
    this.calories = Math.round(this.calories);
  }
}
