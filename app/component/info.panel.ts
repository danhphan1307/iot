import { Component, OnInit, ViewChild, trigger, state, style, animate, transition, Input} from '@angular/core';

@Component({
  selector: 'info',
  template: `
  <div class="title" (click)="toggle()">{{name}}</div>
  <div class="bicylingInfo" [hidden]='!open'>
  Current Speed: {{current}} km/h<br>
  Average Speed: {{distance/timePass}} km/h<br>
  Estimate Time: {{distance/current}} min <br>
  Burned Calories {{calories}}
  </div>`,
  providers: []
})

export class Info implements OnInit{
  name:string = "User name";
  open:boolean = true;
  distance:number = 0;
  current:number = 1 ;
  avarage:number = 0 ;
  calories:number = 0;
  timePass:any = 1;

  toggle(){
    this.open? this.open = false:this.open = true;
  }
  ngOnInit(){
    try {
      if(localStorage.getItem("userInfo") !== null){
        this.name = localStorage.getItem("userInfo");
      }
    }
    catch (e) {
      
    }
  }
}
