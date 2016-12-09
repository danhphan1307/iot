import { Component, OnInit, ViewChild, trigger, state, style, animate, transition, Input} from '@angular/core';

@Component({
  selector: 'info',
  template: `
  <div class="title" (click)="toggle()">{{name}}</div>
  <div class="bicylingInfo" [hidden]='!open'>
  Distance: {{estimateDistance}} km<br>
  Time: {{estimateTime}}<br> 
  Current Speed: {{speed}} km/h<br>
  Distance Left: {{estimateDistance - pastDistance}} km<br>
  Time Left: {{distance/speed}} min <br>
  Burned Calories: {{calories}}
  </div>`,
  providers: []
})

export class Info implements OnInit{
  name:string = "User name";
  open:boolean = true;
  estimateDistance:number = 0;
  estimateTime:string = '0';
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
    setInterval(()=>{
      this.updateData();
    },1000);
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
        this.estimateTime = String(Math.floor(Number(localStorage.getItem("estimateTime"))/60)) + ' min '+String(Number(localStorage.getItem("estimateTime"))%60)+' sec';
      }
    }
    catch (e) {
      console.log(e);
    }
  }
}
