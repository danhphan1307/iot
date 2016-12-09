import { Component, OnInit, ViewChild, trigger, state, style, animate, transition, Input} from '@angular/core';

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
  <tr>
  <td>
  Current Speed
  </td>
  <td>
  {{speed}} km/h
  </td>
  </tr>
  <tr>
  <td>
  Distance Left
  </td>
  <td>
  {{estimateDistance - pastDistance}} km
  </td>
  </tr>
  <tr>
  <td>
  Time Pass
  </td>
  <td>
  {{printDiff(timePass)}}
  </td>
  </tr>
  <tr>
  <td>
  Time Left
  </td>
  <td>
  {{distance/speed}} min
  </td>
  </tr>
  <tr>
  <td>
  Burned Calories
  </td>
  <td>
  {{calories}} cal
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
  speed:number = 1 ;
  avarage:number = 0 ;
  calories:number = 0;
  timePass:any = 1;

  toggle(){
    this.open? this.open = false:this.open = true;
  }
  ngOnInit(){
    try{
      if(localStorage.getItem("timeStart") !== null){
        this.timePass = this.diffTwoDay(new Date(), new Date (localStorage.getItem('timeStart')));
      }
      setInterval(()=>{
        this.updateData();
      },5000);
      setInterval(()=>{
        this.updateTime();
      },1000);
    }
    catch(e){

    }
  }

  updateData(){
    try {
      if(localStorage.getItem("userInfo") !== null){
        this.name = localStorage.getItem("userInfo");
      }
      if(localStorage.getItem("estimateDistance") !== null){
        this.estimateDistance = Number(localStorage.getItem("estimateDistance"))/1000;
      }
      if(localStorage.getItem("estimateTime") !== null){
        this.estimateTime = this.printDiff(Number(localStorage.getItem("estimateTime"))*1000);
      }
      this.calculateCalories(this.speed);
    }
    catch (e) {
      console.log(e);
    }
  }

  updateTime(){
    if(this.speed > 15){
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
